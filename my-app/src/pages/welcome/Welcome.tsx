import React from 'react';
import './Welcome.css';

const Welcome = () => {
  const text = "Clarifina";

  return (
    <section className="welcome_container">
      <h1>
        Hello. Welcome to{' '}
        {text.split('').map((letter, index) => (
          <span key={index} className="title_animation">
            {letter}
          </span>
        ))}
        .
      </h1>
    </section>
  );
};

export default Welcome;
