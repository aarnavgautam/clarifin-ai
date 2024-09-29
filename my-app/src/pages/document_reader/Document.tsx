import React, { useState, useEffect } from 'react';
import { uploadFile, processFile } from "../../services/fileUploadService";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import axios from "axios";
import './Document.css';

import help from '../../assets/helpIcon.png';
import logo from '../../assets/clarifina.png';
import sample from '../../assets/samplePdf.png';
import bookmark from '../../assets/bookmark.png';
import {useLocation, useNavigate} from 'react-router-dom';

const Document: React.FC = () => {
  const location = useLocation();
  console.log(location.state);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<any>();
  const [pdfUrl, setPdfUrl] = useState<string >("");
  const [highlights, setHighlights] = useState<any[]>([]);
  const [clickedWord, setClickedWord] = useState<string>("Select a word.");
  const [wordDescription, setWordDescription] = useState<string>("Select a word to see more!");
  const [analogy, setAnalogy] = useState<string>("You'll see an analogy here soon...");
  
  const highlightPluginInstance = highlightPlugin();

  useEffect(() => {

    setPdfUrl(location.state.downloadURL);
    setFile(location.state.incomingFile);
    handleUploadAndProcess();
    // Fetch chat history when component mounts
    // fetchChatHistory();
  }, [file]);
/*
  // const fetchPdfFile = async () => {
  //   try {
  //     // Fetch the PDF from the Firebase Storage download URL
  //     const response = await fetch(pdfUrl);
  //     const blob = await response.blob();
  //     const newFile = new File([blob], "downloaded-file.pdf", { type: "application/pdf" });
  
  //     setFile(newFile);
  //   } catch (error) {
  //     console.error("Error fetching the PDF:", error);
  //     return null;
  //   }
  // }

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/chat-history");
      setChatHistory(response.data.history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };
*/

  const handleHighlightClick = async (highlight: any) => {
    alert("Your word has been selected, stay tuned for the explanation!");
    const clickedText = highlight.content;
    setClickedWord(clickedText);
    try {
      const res = await axios.post("http://localhost:5001/api/chat", {
        message: `Explain ${highlight.content} and give an analogy. Structure response as [description]. Analogy: [analogy].}`,
    });
    console.log(message);
    const botResponse = res.data.message.replace(/\*\*/g, '') || 'No Response Available.';
    const [descriptionResponse, analogyResponse] = botResponse.split("Analogy: ");
    setWordDescription(descriptionResponse);
    setAnalogy(analogyResponse || 'No Analogy Available.');
    // can possibly remove chat history here
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: `Explain ${highlight.content} and give an analogy. Structure response as [description]. Analogy: [analogy].` },
      { role: "bot", content: res.data.message },
    ]);
  } catch (error) {
    console.error('Error communicating with the API', error);
    setWordDescription('Error: Unable to get a response from the server.');
    setAnalogy('Error: Unable to get a response from the server.');
  }
};

  // For the chatbot, might not be necessary
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

  const slides = [
    {
      title: "Instructions",
      content: (
        <>
          <p className = "instructions">Select the type of assistance you would like with the buttons below. Whether that be with a word, paragraph summary, or our personalized financial advice.</p>
        </>
      ),
    },
    {
      title: "Word Selection",
      content: (
        <>
          <h2 className="word highlight">{clickedWord}</h2>
          <h3 className="phonetic">"poyn-DEK-stur"</h3>
          <p className="description">
            {wordDescription}
          </p>
          <p className="analogy_title">Analogy</p>
          <p className="analogy">The person at a party who talks about complex science topics or coding instead of light conversation.</p>
        </>
      ),
    },
    {
      title: "Paragraph",
      content: (
        <>
          <h2 className="line">{clickedWord}</h2>
          <p>
            {wordDescription}
          </p>
          <p><strong>Analogy:{analogy}</strong> .</p>  
        </>
      ),
    },
    {
      title: "Suggestions",
      content: (
        <>
          <img src={bookmark} className="bookmark" alt="Bookmark" />
          <p className="summary_title">Summary</p>
          <p className = "summary">
            Serendipity is the occurrence of events by chance in a happy or beneficial way. 
            It is often associated with unexpected discoveries that are fortunate or beneficial.
          </p>

          <p className="analogy_title">Next Steps</p>
          <p className = "next_steps">
            Serendipity is the occurrence of events by chance in a happy or beneficial way. 
            It is often associated with unexpected discoveries that are fortunate or beneficial.
          </p>

          <p className="analogy_title">Opportunities For You</p>
          <p className = "opps">
            <ul>
              <li>Serendipity is the occurrence of events by chance</li>
              <li>in a happy or beneficial way. </li>
              <li>It is often associated with unexpected discoveries that are fortunate or beneficial.</li>
            </ul>
          </p>

          </>
      ),
    },
  ];

  return (
    <section className="document_container">
      <a href="/profile">
        <img src={logo} className="document_logo" alt="Logo" />
      </a>
      
      <div className="document_button_container">
        <img src = {help} className = "helpIcon doc_option" onClick={() => setCurrentSlide(0)} />
        <button className="button_normal doc_option doc_button" onClick={() => setCurrentSlide(1)}>Word Selection</button>
        <button className="button_normal doc_option doc_button" onClick={() => setCurrentSlide(2)}>Paragraph</button>
        <button className="button_special doc_option doc_button" onClick={() => setCurrentSlide(3)}>
          <span className="text">Our Suggestions</span>
          <span className="shimmer"></span>
        </button>
      </div>

      <div className="document_content">
        <div className="pdf_container">
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
                fileUrl={URL.createObjectURL(file)}
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
        

        <div className="detail_container">
          <div>
            <h1>{slides[currentSlide].title}</h1>
          </div>
          <div className="detail_content">
            <img src={bookmark} className="bookmark" alt="Bookmark" />
            {slides[currentSlide].content}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Document;
