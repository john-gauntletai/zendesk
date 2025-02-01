const express = require('express');
const router = express.Router();
const { TavilySearchResults } = require("@langchain/community/tools/tavily_search");
const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { ToolNode } = require("@langchain/langgraph/prebuilt");
const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");
const supabase = require('../supabase');

// Define the tools and models
const tools = [new TavilySearchResults({ maxResults: 3 })];
const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({
  modelName: "gpt-4-turbo-preview",
  temperature: 0,
}).bindTools(tools);

// Create separate workflows for categories and articles
function createWorkflow() {
  return new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .addNode("tools", toolNode)
    .addEdge("tools", "agent")
    .addConditionalEdges("agent", shouldContinue)
    .compile();
}

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

// Update the helper function to handle both arrays and objects
function extractJSON(text) {
  try {
    // First try direct parse
    return JSON.parse(text);
  } catch (e) {
    // Look for JSON structure in the text - either array or object
    const match = text.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        console.error("Parsing error:", e);
        console.error("Matched text:", match[0]);
        throw new Error("Could not parse valid JSON from response");
      }
    }
    console.error("Raw response:", text);
    throw new Error("No JSON structure found in response");
  }
}

// Also update the categories prompt to be more explicit about array format
async function generateCategories(kb, brandVoiceExample) {
  const categoriesPrompt = `You are an expert help center architect with access to a web search tool. Your task is to:

1. Research ${kb.name} using the search tool to understand:
   - Common customer questions and problems
   - Industry best practices
   - Key features and use cases
   - Competitor help centers

2. Based on your research, identify 4-6 key categories that would best serve users of ${kb.name}. 
   Each category should address a major area of user needs.

CRITICAL: You must respond with ONLY a JSON array. No other text, no explanations.
Format must be exactly like this (with real values):

[
  {
    "name": "Getting Started",
    "emoji_icon": "🚀",
    "description": "Learn the basics and set up your account"
  },
  {
    "name": "Account Management",
    "emoji_icon": "👤",
    "description": "Handle user settings and permissions"
  }
]`;

  const workflow = createWorkflow();
  const finalState = await workflow.invoke({
    messages: [
      new SystemMessage(categoriesPrompt),
      new HumanMessage(`Create categories for ${kb.name}. Description: ${kb.description}. Remember to ONLY return the JSON array.`)
    ],
  });

  const lastMessage = finalState.messages[finalState.messages.length - 1];
  console.log("Raw categories response:", lastMessage.content); // For debugging

  try {
    const categories = extractJSON(lastMessage.content);
    if (!Array.isArray(categories)) {
      throw new Error("Response is not an array");
    }
    categories.forEach((category, index) => {
      if (!category.name || !category.emoji_icon || !category.description) {
        throw new Error(`Invalid category at index ${index}`);
      }
    });
    return categories;
  } catch (error) {
    console.error("Categories parsing error:", error);
    throw error;
  }
}

async function generateArticlesForCategory(kb, category, brandVoiceExample, additionalNotes) {
  const articlesPrompt = `You are an expert content writer with access to a web search tool. Your task is to:

1. Research and create 3-5 helpful articles for the "${category.name}" category of ${kb.name}'s help center.
   Category description: ${category.description}

2. Each article should:
   - Be 300-500 words
   - Address real user needs discovered in research
   - Include practical solutions and examples
   - For harder instructions, use bullet points or lists
   - Match this brand voice example: "${brandVoiceExample}"
   - Consider these additional notes: "${additionalNotes}"

IMPORTANT: Return ONLY a valid JSON array of articles with no additional text:
[
  {
    "title": "string",
    "description": "string",
    "body": "string"
  }
]`;

  const workflow = createWorkflow();
  const finalState = await workflow.invoke({
    messages: [
      new SystemMessage(articlesPrompt),
      new HumanMessage(`Create articles for the ${category.name} category`)
    ],
  });

  return extractJSON(finalState.messages[finalState.messages.length - 1].content);
}

router.post('/:kbId/ai-generate', async (req, res) => {
  try {
    const { kbId } = req.params;
    const { brandVoiceExample, additionalNotes } = req.body;
    const { data: user } = await supabase.from('users').select('org_id').eq('id', req.user.id).single();
    const { data: kb } = await supabase.from('knowledgebases').select('*').eq('id', kbId).single();

    // Step 1: Generate categories
    const categories = await generateCategories(kb, brandVoiceExample);

    // Step 2: Create categories in database and generate articles for each
    for (const categoryData of categories) {
      // Create category
      const { data: newCategory, error: categoryError } = await supabase
        .from('categories')
        .insert({
          name: categoryData.name,
          emoji_icon: categoryData.emoji_icon,
          knowledgebase_id: kbId,
          org_id: user.org_id
        })
        .select()
        .single();

      if (categoryError) throw categoryError;

      // Generate and create articles for this category
      const articles = await generateArticlesForCategory(kb, categoryData, brandVoiceExample, additionalNotes);

      // Insert articles
      for (const article of articles) {
        await supabase.from('articles').insert({
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
          org_id: user.org_id,
          created_by: req.user.id,
          last_updated_by: req.user.id,
          last_updated_at: new Date().toISOString()
        });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

module.exports = router;