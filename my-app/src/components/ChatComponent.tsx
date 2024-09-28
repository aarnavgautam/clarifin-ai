import React, { useState, useEffect } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch chat history when component mounts
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/chat-history");
      setChatHistory(response.data.history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5001/api/chat", {
        message,
      });

      // Append new message and the bot response to chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: message }, // User message
        { role: "bot", content: res.data.message }, // Bot response
      ]);

      setMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error communicating with the API", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "bot", content: "Error: Unable to get a response from the server." },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Financial Advisor Chatbot</h1>

      <div className="chat-history" style={{ marginBottom: "20px", height: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {chatHistory.map((message, index) => (
          <div key={index} className={`message ${message.role}`} style={{ marginBottom: "10px" }}>
            <strong>{message.role === "user" ? "You" : "Bot"}:</strong> {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask your financial question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
          style={{ width: "400px", padding: "10px" }}
        />
        <br />
        <button type="submit" disabled={isLoading} style={{ marginTop: "10px" }}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default App;
