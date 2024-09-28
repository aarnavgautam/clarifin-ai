import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const [showHeading, setShowHeading] = useState(false);
  const [showParagraph, setShowParagraph] = useState(false);
  const [shiftRight, setShiftRight] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowHeading(true);

    const paragraphTimer = setTimeout(() => {
      setShowParagraph(true);
    }, 2000);

    const shiftTimer = setTimeout(() => {
      setShiftRight(true);
    }, 6000);

    const redirectTimer = setTimeout(() => {
      navigate('/user-information'); // Replace '/new-page' with your desired route
    }, 7000);

    return () => {
      clearTimeout(paragraphTimer);
      clearTimeout(shiftTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <section className={`welcome_container ${shiftRight ? 'shift-right' : ''}`}>
      <h1 className={showHeading ? 'slide-in' : ''}>
        Hello. Welcome to Clarifina.
      </h1>
      {showParagraph && (
        <p className="fade-in">
          Reading financial documents has never been this easy.
        </p>
      )}
    </section>
  );
};

export default Welcome;