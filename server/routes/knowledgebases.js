const express = require('express');
const router = express.Router();
const { TavilySearchResults } = require("@langchain/community/tools/tavily_search");
const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { ToolNode } = require("@langchain/langgraph/prebuilt");
const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");
const supabase = require('../supabase');
const { v4: uuidv4 } = require('uuid');
const { marked } = require('marked');

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

// Add status update helper
function createStatusEmitter(res) {
  return {
    send: (status) => {
      res.write(`data: ${JSON.stringify(status)}\n\n`);
    }
  };
}

// Add a map to store active generations
const activeGenerations = new Map();

// Add this after the other helper functions
async function generateContent(generationId) {
  const generation = activeGenerations.get(generationId);
  if (!generation) {
    throw new Error('Generation not found');
  }

  const { userId, kbId, brandVoiceExample, additionalNotes } = generation;

  try {
    // Add status field to track progress
    generation.status = { status: 'started', message: 'Starting content generation...' };

    const { data: userData } = await supabase.from('users').select('org_id').eq('id', userId).single();
    const { data: kb } = await supabase.from('knowledgebases').select('*').eq('id', kbId).single();

    // Step 1: Generate categories
    generation.status = { status: 'researching', message: 'Researching and planning categories...' };
    const categories = await generateCategories(kb, brandVoiceExample);
    
    generation.status = { 
      status: 'categories_done', 
      message: `Generated ${categories.length} categories. Creating articles...` 
    };

    // Step 2: Create categories and articles
    let completedCategories = 0;
    for (const categoryData of categories) {
      generation.status = { 
        status: 'generating_articles',
        message: `Creating articles for category "${categoryData.name}" (${completedCategories + 1}/${categories.length})...`
      };

      // Create category
      const { data: newCategory, error: categoryError } = await supabase
        .from('categories')
        .insert({
          name: categoryData.name,
          emoji_icon: categoryData.emoji_icon,
          knowledgebase_id: kbId,
          org_id: userData.org_id
        })
        .select()
        .single();

      if (categoryError) throw categoryError;

      // Generate and create articles
      const articles = await generateArticlesForCategory(kb, categoryData, brandVoiceExample, additionalNotes);

      // Insert articles
      for (const article of articles) {
        const { error: articleError } = await supabase
          .from('articles')
          .insert({
            title: article.title,
            description: article.description,
            body: JSON.stringify(markdownToTipTap(article.body)),
            status: 'published',
            category_id: newCategory.id,
            knowledgebase_id: kbId,
            org_id: userData.org_id,
            created_by: userId,
            last_updated_by: userId,
            last_updated_at: new Date().toISOString()
          });

        if (articleError) throw articleError;
      }

      completedCategories++;
    }

    generation.status = { status: 'completed', message: 'Content generation completed!' };
    activeGenerations.delete(generationId);
  } catch (error) {
    generation.status = { 
      status: 'error', 
      message: 'Failed to generate content',
      error: error.message 
    };
    console.error('Generation error:', error);
    activeGenerations.delete(generationId);
    throw error;
  }
}

// Add this helper function to convert markdown to Tiptap JSON
function markdownToTipTap(markdown) {
  const tokens = marked.lexer(markdown);
  const content = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'paragraph':
        content.push({
          type: 'paragraph',
          content: parseInlineContent(token.tokens)
        });
        break;

      case 'heading':
        content.push({
          type: 'heading',
          attrs: { level: token.depth },
          content: parseInlineContent(token.tokens)
        });
        break;

      case 'list':
        content.push({
          type: token.ordered ? 'orderedList' : 'bulletList',
          content: token.items.map(item => ({
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: parseInlineContent(item.tokens)
              }
            ]
          }))
        });
        break;

      case 'space':
        break;

      default:
        console.log('Unhandled token type:', token.type);
    }
  }

  return {
    type: 'doc',
    content
  };
}

function parseInlineContent(tokens) {
  const content = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'text':
        content.push({
          type: 'text',
          text: token.text
        });
        break;

      case 'strong':
        content.push({
          type: 'text',
          marks: [{ type: 'bold' }],
          text: token.text
        });
        break;

      case 'em':
        content.push({
          type: 'text',
          marks: [{ type: 'italic' }],
          text: token.text
        });
        break;

      case 'link':
        // Handle link as a paragraph with text inside
        content.push({
          type: 'paragraph',
          content: [{
            type: 'text',
            text: token.text
          }]
        });
        break;

      case 'code':
        content.push({
          type: 'text',
          marks: [{ type: 'code' }],
          text: token.text
        });
        break;

      default:
        if (token.text) {
          content.push({
            type: 'text',
            text: token.text
          });
        } else {
          console.log('Unhandled inline token type:', token.type);
        }
    }
  }

  return content;
}

// Update the POST endpoint to handle errors better
router.post('/:kbId/ai-generate', async (req, res) => {
  try {
    const { kbId } = req.params;
    const { brandVoiceExample, additionalNotes } = req.body;
    
    const generationId = uuidv4();
    
    activeGenerations.set(generationId, {
      userId: req.user.id,
      kbId,
      brandVoiceExample,
      additionalNotes
    });

    // Start the generation process in the background
    generateContent(generationId).catch(error => {
      console.error('Background generation error:', error);
      activeGenerations.delete(generationId);
    });

    // Return success immediately
    res.json({ generationId, status: 'started' });
  } catch (error) {
    console.error('Error starting generation:', error);
    // Only send error response if headers haven't been sent
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to start generation' });
    }
  }
});

// Update the status endpoint to use generationId
router.get('/:kbId/ai-generate/status', async (req, res) => {
  const { kbId } = req.params;
  const { token, generationId } = req.query;

  try {
    // Verify token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).send('Unauthorized');
    }

    // Check if generation exists
    const generation = activeGenerations.get(generationId);
    if (!generation) {
      return res.status(404).json({ error: 'Generation not found' });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const statusEmitter = createStatusEmitter(res);
    
    // Send initial status
    if (generation.status) {
      statusEmitter.send(generation.status);
    } else {
      statusEmitter.send({ status: 'connected', message: 'Monitoring generation progress...' });
    }

    // Keep connection open and monitor progress
    const checkInterval = setInterval(() => {
      const currentGeneration = activeGenerations.get(generationId);
      if (!currentGeneration) {
        statusEmitter.send({ status: 'completed', message: 'Content generation completed!' });
        clearInterval(checkInterval);
        res.end();
      } else if (currentGeneration.status) {
        statusEmitter.send(currentGeneration.status);
      }
    }, 1000);

    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(checkInterval);
    });
  } catch (error) {
    console.error('Status error:', error);
    if (!res.headersSent) {
      res.status(500).send('Server error');
    }
  }
});

module.exports = router;