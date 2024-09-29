import React, { useState, useEffect } from "react";
import axios from "axios";
import { uploadFile, processFile } from "../services/fileUploadService";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

const CombinedComponent: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<any[]>([]);
  const highlightPluginInstance = highlightPlugin();

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

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: message },
        { role: "bot", content: res.data.message },
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setPdfUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleUploadAndProcess = async () => {
    if (file) {
      await uploadFile(file);
      const extractedData = await processFile(file.name);

      extractedData.forEach(async (line: any) => {

        const digitCount = (line.text.match(/\d/g) || []).length;  // Count all digits in the string
        const totalCount = line.text.length;

        if (digitCount <= totalCount / 2){
            try {
                // Check if the line contains complex financial terminology
                const response = await axios.post("http://localhost:5001/api/check-terminology", {
                    text: line.text,
                });

                console.log(response.data.isComplex);
                if (response.data.isComplex) {
                    setHighlights((prevHighlights) => [
                    ...prevHighlights,
                    {
                        content: line.text,
                        pageIndex: line.page - 1,
                        position: {
                        top: `${line.boundingBox.Top * 100}%`,
                        left: `${line.boundingBox.Left * 100}%`,
                        width: `${line.boundingBox.Width * 100}%`,
                        height: `${line.boundingBox.Height * 100}%`,
                        },
                    },
                    ]);
                }
            } 
            catch (error) {
            console.error("Error checking terminology:", error);
            }
        }
      });
    }
  };

  const handleHighlightClick = async (highlight: any) => {
    try {
      const res = await axios.post("http://localhost:5001/api/chat", {
        message: `Explain: ${highlight.content}`,
      });

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: `Explain: ${highlight.content}` },
        { role: "bot", content: res.data.message },
      ]);
    } catch (error) {
      console.error("Error communicating with the API", error);
    }
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* Chatbot Section */}
      <div style={{ flex: 1, marginRight: "20px" }}>
        <h1>Financial Advisor Chatbot</h1>
        <div
          className="chat-history"
          style={{
            marginBottom: "20px",
            height: "300px",
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role}`}
              style={{ marginBottom: "10px" }}
            >
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
          <button
            type="submit"
            disabled={isLoading}
            style={{ marginTop: "10px" }}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>

      {/* PDF Section */}
      <div style={{ flex: 2 }}>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUploadAndProcess}>Upload and Process</button>

        {pdfUrl && (
          <div
            style={{
              width: "1000px",
              height: "500px",
              marginTop: "20px",
              position: "relative",
            }}
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
              <Viewer
                fileUrl={pdfUrl}
                plugins={[highlightPluginInstance]}
                renderPage={(props) => {
                  props.markRendered(props.pageIndex);
                  return (
                    <div key={props.pageIndex}>
                      <div
                        style={{
                          zIndex: 1,
                          pointerEvents: "none",
                        }}
                      >
                        {props.canvasLayer.children}
                      </div>

                      {highlights
                        .filter((h) => h.pageIndex === props.pageIndex)
                        .map((highlight, index) => (
                          <div
                            key={index}
                            onClick={() => handleHighlightClick(highlight)}
                            style={{
                              position: "absolute",
                              zIndex: 10,
                              top: highlight.position.top,
                              left: highlight.position.left,
                              width: highlight.position.width,
                              height: highlight.position.height,
                              backgroundColor: "rgba(255, 255, 0, 0.5)",
                              cursor: "pointer",
                            }}
                          />
                        ))}
                    </div>
                  );
                }}
              />
            </Worker>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedComponent;
