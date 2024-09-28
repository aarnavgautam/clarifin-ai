import React, { useEffect, useState } from 'react';
import './Document.css';

import logo from '../../assets/purple_logo.png';
import sample from '../../assets/samplePdf.png';

const Document = () => {
  const [isPulsating, setIsPulsating] = useState(false);

  useEffect(() => {
    setIsPulsating(true);

    const timer = setTimeout(() => {
      setIsPulsating(false);
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <section className="document_container">
      <a href="/">
        <img src={logo} className="document_logo" alt="Logo" />
      </a>

      <p>Instructions: Lorem Ipsum has been the industry's standard dummy text ever since the 1500s Lorem Ipsum has been the industry's standard dummy text ever since the 1500 Lorem Ipsum has been the industry's standard dummy text ever since the 1500 Lorem Ipsum has been the industry's standard dummy text ever since the 1500...</p>
      
      <div className="document_button_container">
        <button className="button_normal">Word Selection</button>
        <button className="button_normal">Paragraph</button>
        <button className={`button_special ${isPulsating ? 'pulsate' : ''}`}>
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
            <h1>Document Analysis</h1>
          </div>
          <div className = "detail_content">
            <div className = "detail_content_inside">
              <h2 className = ""><mark>poindexter</mark></h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Document;
