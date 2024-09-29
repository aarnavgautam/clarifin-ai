require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5001;

// Import chatbot logic from another file
const { handleChat, getChatHistory, isFinanceTerm } = require("./chatbot");

app.use(cors());
app.use(bodyParser.json());

// Chat endpoint
app.post("/api/chat", handleChat);

// Endpoint to get conversation history
app.get("/api/chat-history", getChatHistory);

app.post("/api/check-terminology", isFinanceTerm);

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
