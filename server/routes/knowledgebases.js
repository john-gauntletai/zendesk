const express = require('express');
const router = express.Router();
const { TavilySearchResults } = require("@langchain/community/tools/tavily_search");
const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { ToolNode } = require("@langchain/langgraph/prebuilt");
const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");
const supabase = require('../supabase');

// Define the tools for the agent to use
const tools = [new TavilySearchResults({ maxResults: 3 })];
const toolNode = new ToolNode(tools);

// Create a model and give it access to the tools
const model = new ChatOpenAI({
  modelName: "gpt-4-turbo-preview",
  temperature: 0,
}).bindTools(tools);

// Define the function that determines whether to continue or not
function shouldContinue({ messages }) {
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.additional_kwargs.tool_calls) {
    return "tools";
  }
  return "__end__";
}

// Define the function that calls the model
async function callModel(state) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

// Create the agent workflow
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addNode("tools", toolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue);

const app = workflow.compile();

// Add this helper function at the top
function extractJSON(text) {
  try {
    // First try direct parse
    return JSON.parse(text);
  } catch (e) {
    // Look for JSON structure in the text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        throw new Error("Could not parse valid JSON from response");
      }
    }
    throw new Error("No JSON structure found in response");
  }
}

router.post('/:kbId/ai-generate', async (req, res) => {
  try {
    const { kbId } = req.params;
    const { brandVoiceExample, additionalNotes } = req.body;

    const { data: user, error: userError } = await supabase.from('users').select('org_id').eq('id', req.user.id).single();

    if (userError) throw userError;
    const orgId = user.org_id;

    // Get knowledge base details
    const { data: kb, error: kbError } = await supabase
      .from('knowledgebases')
      .select('*')
      .eq('id', kbId)
      .single();

    if (kbError) throw kbError;

    // Update the system prompt to be more strict about JSON response
    const systemPrompt = `You are an expert help center architect with access to a web search tool. Your task is to:

1. First, research ${kb.name} using the search tool to understand:
   - Common customer questions and problems
   - Industry best practices
   - Key features and use cases
   - Competitor help centers

2. Based on your research, identify 4-6 key categories that would best serve users of ${kb.name}. Each category should address a major area of user needs.

3. For each category, research specific topics and create 3-5 helpful articles with about 300-500 words each. Each article should:
   - Address real user needs discovered in research
   - Include practical solutions and examples
   - Match this brand voice example: "${brandVoiceExample}"
   - Consider these additional notes: "${additionalNotes}"

IMPORTANT: Your response must be a valid JSON object only, with no additional text before or after. Use this exact format:

{
  "categories": [
    {
      "name": "string",
      "emoji_icon": "string",
      "articles": [
        {
          "title": "string",
          "description": "string", 
          "body": "string"
        }
      ]
    }
  ]
}`;

    // Update the human message to be more explicit
    const humanMessage = new HumanMessage(
      `Research and create a help center structure for ${kb.name}. Description: ${kb.description}

Remember to:
1. Use the search tool to research thoroughly
2. Return ONLY valid JSON in the specified format
3. Include no explanation text - just the JSON object`
    );

    // Update the response handling
    const finalState = await app.invoke({
      messages: [new SystemMessage(systemPrompt), humanMessage],
    });

    const lastMessage = finalState.messages[finalState.messages.length - 1];
    let generatedContent;
    try {
      generatedContent = extractJSON(lastMessage.content);
      
      // Validate the structure
      if (!generatedContent.categories || !Array.isArray(generatedContent.categories)) {
        throw new Error("Invalid response structure");
      }
      
      // Validate each category has required fields
      generatedContent.categories.forEach((category, index) => {
        if (!category.name || !category.emoji_icon || !Array.isArray(category.articles)) {
          throw new Error(`Invalid category structure at index ${index}`);
        }
        
        category.articles.forEach((article, artIndex) => {
          if (!article.title || !article.description || !article.body) {
            throw new Error(`Invalid article structure in category ${index} at article ${artIndex}`);
          }
        });
      });
    } catch (error) {
      console.error("Response parsing error:", error);
      console.error("Raw response:", lastMessage.content);
      throw new Error("Failed to parse AI response");
    }

    // Insert categories and articles into database
    for (const category of generatedContent.categories) {
      // Create category
      const { data: newCategory, error: categoryError } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          emoji_icon: category.emoji_icon,
          knowledgebase_id: kbId,
          org_id: orgId
        })
        .select()
        .single();

      if (categoryError) throw categoryError;

      // Create articles for this category
      for (const article of category.articles) {
        const { error: articleError } = await supabase
          .from('articles')
          .insert({
            title: article.title,
            description: article.description,
            body: JSON.stringify({
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: article.body }]
                }
              ]
            }),
            status: 'published',
            category_id: newCategory.id,
            knowledgebase_id: kbId,
            org_id: orgId,
            created_by: req.user.id,
            last_updated_by: req.user.id,
            last_updated_at: new Date().toISOString()
          });

        if (articleError) throw articleError;
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

module.exports = router;