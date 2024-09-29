const OpenAI = require("openai");

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API key loaded correctly from .env
});

// In-memory storage for conversation history
let conversationHistory = [];

// Handle chat requests
const handleChat = async (req, res) => {
  const userInput = req.body.message;

  // Add user message to history
  conversationHistory.push({ role: 'user', content: userInput });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful financial advisor who can simplify and explain financial terms.' },
        ...conversationHistory // Include the full conversation history
      ],
    });

    console.log('OpenAI API Response:', JSON.stringify(response, null, 2));

    if (response && response.choices && response.choices[0] && response.choices[0].message) {
      const aiMessage = response.choices[0].message.content;
      
      // Add AI response to history
      conversationHistory.push({ role: 'assistant', content: aiMessage });
      
      // Send back the full conversation history
      res.json({
        message: aiMessage,
        history: conversationHistory
      });
    } else {
      console.error('Unexpected response structure:', response);
      res.status(500).json({ error: 'Unexpected response structure from OpenAI API' });
    }
  } catch (error) {
    console.error('Error details:', error);
    if (error.response) {
      console.error('OpenAI API error response:', error.response.data);
    }
    res.status(500).json({
      error: error.message || 'An error occurred while processing your request',
      details: error.response?.data || 'No additional details available'
    });
  }
};

// Get chat history
const getChatHistory = (req, res) => {
  res.json({ history: conversationHistory });
};

// Checking financial terminology validity
const isFinanceTerm =  async (req, res) => {
  const { text } = req.body;
  console.log(text);

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    // Make a call to OpenAI API to determine if the text contains complex financial terminology

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `Determine if the following text contains financial terminology that may not be understood by some audiences. 
          Respond with "yes" if it does, and "no" if it does not.\n\n"${text}"` }
      ],
    });

    const aiMessage = response.choices[0].message.content.toLowerCase();

    if (aiMessage == "yes") {
      console.log("Finance term has been found!");
      res.json({ isComplex: true });
    } else {
      console.log("Non-Finance term");
      res.json({ isComplex: false });
    }
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  handleChat,
  getChatHistory,
  isFinanceTerm
};
