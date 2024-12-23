import React, { useState, useEffect } from "react";
import { uploadFile, processFile } from "../../services/fileUploadService";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import axios from "axios";
import "./Document.css";
import { db } from "../../firebaseConfig/firebase.js";

import help from "../../assets/helpIcon.png";
import logo from "../../assets/clarifina.png";
import sample from "../../assets/samplePdf.png";
import bookmark from "../../assets/bookmark.png";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

const fetchUserData = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      console.log("Document data:", userSnap.data());
      const userData = userSnap.data();
      return userData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
};

const Document: React.FC = () => {
  const location = useLocation();
  console.log(location.state);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showLoading, setShowLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<any>();
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [highlights, setHighlights] = useState<any[]>([]);
  const [clickedWord, setClickedWord] = useState<string>("Select a word.");
  const [wordDescription, setWordDescription] = useState<string>(
    "Select a word to see more!"
  );
  const [analogy, setAnalogy] = useState<string>(
    "You'll see an analogy here soon..."
  );
  const [summary, setSummary] = useState<string>(
    "Summary of the paragraph will be displayed here."
  );
  const [nextSteps, setNextSteps] = useState<string>('Next steps will be displayed here.');
  const [opportunities, setOpportunities] = useState<string>('Opportunities will be displayed here.');
  const highlightPluginInstance = highlightPlugin();


  useEffect(() => {
    setPdfUrl(location.state.downloadURL);
    setFile(location.state.incomingFile);
    handleUploadAndProcess();
    // Fetch chat history when component mounts
    // fetchChatHistory();

    const uid = location.state.uid;
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

  const handleSummarizeDocument = async () => {
    setIsLoading(true);
    try {
      const documentText = JSON.stringify(file);
      const res = await axios.post("http://localhost:5001/api/chat", {
        message: `Summarize ${documentText}}`,
      });
      console.log(message);
      const summaryResponse =
        res.data.message.replace(/\*\*/g, "") || "No Response Available.";
      const summary = summaryResponse;
      setSummary(summary);
    } catch (error) {
      console.error("Error communicating with the API", error);
      setSummary("Error: Unable to get a response from the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHighlightClick = async (highlight: any) => {
    const clickedText = highlight.content;
    setClickedWord(clickedText);
    try {
      const res = await axios.post("http://localhost:5001/api/chat", {
        message: `Explain ${highlight.content} and give an analogy. Structure response as [description]. Analogy: [analogy].}`,
      });
      console.log(message);
      const botResponse =
        res.data.message.replace(/\*\*/g, "") || "No Response Available.";
      const [descriptionResponse, analogyResponse] =
        botResponse.split("Analogy: ");
      setWordDescription(descriptionResponse);
      setAnalogy(analogyResponse || "No Analogy Available.");
      // can possibly remove chat history here
    } catch (error) {
      console.error("Error communicating with the API", error);
      setWordDescription("Error: Unable to get a response from the server.");
      setAnalogy("Error: Unable to get a response from the server.");
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
        {
          role: "bot",
          content: "Error: Unable to get a response from the server.",
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleUploadAndProcess = async () => {
    if (file) {
      await uploadFile(file);
      const extractedData = await processFile(file.name);
      const outputData = extractedData;
      type outputDataType = { text: string }[];
      // gpt
      const userData = await fetchUserData(location.state.uid);
      if (userData) {
        // getting data from firebase
        try {
          let documentText = (outputData as outputDataType)
            .map((line) => line.text)
            .join(" ");
          if (documentText.length > 5000) {
            documentText = documentText.substring(0, 5000);
          }
          // summarization request with gpt 
          try {
            const response = await axios.post(
              "http://localhost:5001/api/chat",
              {
                message:
                  "Summarize " +
                  documentText +
                  " by creating a 5-7 sentence summary with no formatting included. Be succinct. Use " +
                  userData.age + ", " + userData.ethnicity + ", " + userData.gender + ", " + userData.income + 
                  " as the focus of the summary.",
              }
            );
            const summaryResponse =
              response.data.message || "No Response Available.";
            setSummary(summaryResponse);
          } catch (error) {
            console.error("Error communicating with the GPT API", error);
            setSummary("Error: Unable to get a response from the server.");
          }
          // next steps with gpt
          try {
            const response = await axios.post(
              "http://localhost:5001/api/chat",
              {
                message:
                  "Find the next steps based on the followint text: " +
                  documentText +
                  " by creating a 5-7 sentence action plan with no formatting included. Be succinct. Use " +
                  userData.age + ", " + userData.ethnicity + ", " + userData.gender + ", " + userData.income + 
                  " as the focus of the summary.",
              }
            );
            const nextStepsResponse =
              response.data.message || "No Response Available.";
            setNextSteps(nextStepsResponse);
          } catch (error) {
            console.error("Error communicating with the GPT API", error);
            setNextSteps("Error: Unable to get a response from the server.");
          }
          // opportunities
          try {
            const response = await axios.post(
              "http://localhost:5001/api/chat",
              {
                message:
                  "Using: " +
                  documentText +
                  ", find opportunities for the following demographic with no formatting included. Be succinct. Use " +
                  userData.age + ", " + userData.ethnicity + ", " + userData.gender + ", " + userData.income + 
                  " as the focus of the opportunities. Find 3-5 and list them in paragraph form.",
              }
            );
            const opportunitiesResponse =
              response.data.message || "No Response Available.";
            setOpportunities(opportunitiesResponse);
          } catch (error) {
            console.error("Error communicating with the GPT API", error);
            setOpportunities("Error: Unable to get a response from the server.");
          }
        } catch (error) {
          console.log(error);
        }

        extractedData.forEach(async (line: any) => {
          const digitCount = (line.text.match(/\d/g) || []).length; // Count all digits in the string
          const totalCount = line.text.length;

          if (digitCount <= totalCount / 2) {
            try {
              // Check if the line contains complex financial terminology
              const response = await axios.post(
                "http://localhost:5001/api/check-terminology",
                {
                  text: line.text,
                }
              );

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
            } catch (error) {
              console.error("Error checking terminology:", error);
            }
          }
        });

        // Here is where we would stop the loading from being rendered
        setShowLoading(false);

      }
    }
  };

    const slides = [
      {
        title: "Instructions",
        content: (
          <>
            <p className="instructions">
              Select the type of assistance you would like with the buttons
              below. Whether that be with a word or our
              personalized financial advice.
            </p>
          </>
        ),
      },
      {
        title: "Word Selection",
        content: (
          <>
            <h2 className="word highlight">{clickedWord}</h2>
            <p className="description">{wordDescription}</p>
            <p className="analogy_title">Analogy</p>
            <p className="analogy">
              The person at a party who talks about complex science topics or
              coding instead of light conversation.
            </p>
          </>
        ),
      },
      {
        title: "Paragraph",
        content: (
          <>
            <h2 className="line">{clickedWord}</h2>
            <p>{wordDescription}</p>
            <p>
              <strong>Analogy:{analogy}</strong> .
            </p>
          </>
        ),
      },
      {
        title: "Suggestions",
        content: (
          <>
            <img src={bookmark} className="bookmark" alt="Bookmark" />
            <p className="summary_title">Summary</p>
            <p className="summary">{summary}</p>

            <p className="analogy_title">Next Steps</p>
            <p className="next_steps">
              {nextSteps}
            </p>

            <p className="analogy_title">Opportunities For You</p>
            <p className="opps">
                {opportunities}
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
          <button
            className="button_normal doc_option doc_button"
            onClick={() => setCurrentSlide(0)}
          >
            Instructions
          </button>
          <button
            className="button_normal doc_option doc_button"
            onClick={() => setCurrentSlide(1)}
          >
            Word Selection
          </button>
          {/*<button
            className="button_normal doc_option doc_button"
            onClick={() => setCurrentSlide(2)}
          >
            Paragraph
          </button>*/}
          <button
            className="button_special doc_option doc_button"
            onClick={() => setCurrentSlide(3)}
          >
            <span className="text">Our Suggestions</span>
            <span className="shimmer"></span>
          </button>
        </div>

        <div className="document_content" >
          <div className="pdf_container">

            <h1> 
              Document Viewer
            </h1>
            {pdfUrl && (

              <div
                style={{
                  width: "1000px",
                  height: "500px",
                  marginTop: "0px",
                  position: "relative",
                }}
              > 

                {showLoading && (<div id="loading-div">
                  <h1>Loading</h1>
                  <div className="spinner"></div>
                </div>)}

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
  };


export default Document;
