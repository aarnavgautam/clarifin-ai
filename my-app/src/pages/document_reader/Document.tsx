import React, { useState } from 'react';
import './Document.css';

import help from '../../assets/helpIcon.png';
import logo from '../../assets/clarifina.png';
import sample from '../../assets/samplePdf.png';
import bookmark from '../../assets/bookmark.png';

const Document: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

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
          <h2 className="word highlight">poindexters</h2>
          <h3 className="phonetic">"poyn-DEK-stur"</h3>
          <p className="description">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry...
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
          <h2 className="line"> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </h2>
          <p>
            Serendipity is the occurrence of events by chance in a happy or beneficial way. 
            It is often associated with unexpected discoveries that are fortunate or beneficial.
          </p>
          <p><strong>Example:</strong> For example, finding a $20 bill in your coat pocket that you forgot about.</p>
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
        <button className="button_normal doc_option" onClick={() => setCurrentSlide(1)}>Word Selection</button>
        <button className="button_normal doc_option" onClick={() => setCurrentSlide(2)}>Paragraph</button>
        <button className="button_special doc_option" onClick={() => setCurrentSlide(3)}>
          <span className="text">Our Suggestions</span>
          <span className="shimmer"></span>
        </button>
      </div>

      <div className="document_content">
        <div className="pdf_container">
          <iframe 
            src={sample} 
            width="100%" 
            height="600px"
            style={{ border: 'none' }}
            title="PDF Document"
          ></iframe>
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
