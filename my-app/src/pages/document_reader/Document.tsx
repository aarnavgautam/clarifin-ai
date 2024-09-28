import React from 'react';
import './Document.css';

import logo from '../../assets/purple_logo.png';
import sample from '../../assets/samplePdf.png';

const Document = () => {
  return (
    <section className="document_container">
       <a href="/">
        <img src={logo} className="document_logo" alt="Logo" />
      </a>

      <p>Instructions: Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      
      <div className = "document_button_container">
        <button className = "button_normal">Word Selection</button>
        <button className = "button_normal">Paragraph</button>
        <button className = "button_suggestion">
          <span className = "text">Our Suggestions</span>
        </button>

        
      </div>

      <div className="document_content">
        <div className="pdf_container">
          <iframe 
            src={sample} // Replace with your PDF URL
            width="100%" 
            height="600px" // Adjust height as necessary
            style={{ border: 'none' }}
            title="PDF Document"
          ></iframe>
        </div>

        <div className="detail_container">
          these are details
        </div>
      </div>
    </section>
  );
}

export default Document;
