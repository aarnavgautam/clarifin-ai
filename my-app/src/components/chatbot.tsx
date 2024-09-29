import React, { useState, useEffect } from "react";
import axios from "axios";
import "./chatbot.css";
const Chatbot: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
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

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: message }, 
        { role: "bot", content: res.data.message },
      ]);

      setMessage(""); 
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
    <div className="chatbot-container">
      <div className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close Chat" : "Open Chat"}
      </div>
      {isOpen && (
        <div className="chat-window">
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
              style={{ width: "255px", padding: "10px" }}
            />
            <br />
            <button type="submit" disabled={isLoading} style={{ marginTop: "10px" }}>
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
