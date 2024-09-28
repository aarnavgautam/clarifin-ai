import React, { useEffect, useState } from 'react';
import './Welcome.css';

const Welcome = () => {
  const [showParagraph, setShowParagraph] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParagraph(true);
    }, 2000);  // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="welcome_container">
      <h1>Hello. Welcome to Clarifina.</h1>
      {showParagraph && (
        <p className="fade-in">
          Reading financial documents has never been this easy.
        </p>
      )}
    </section>
  );
};

export default Welcome;