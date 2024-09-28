import React from 'react';
import './Home.css';
import purpleLogo from '../../assets/purple_logo.png';

const Home = () => {
  return (
    <section className="home_container animated_background">
      <div className="home_content">
        <div className="home_title">
          <img src={purpleLogo} className="home_logo" alt="Logo" />
          <h2>Clarifying financial documents, together.</h2>
        </div>

        <div className="home_login">
          <h2>Login</h2>
          <form>
            <div>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" required />
            </div>
            <div className="home_option">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" required />
            </div>
            <button type="submit">Login</button>
            <p>Don't have an account? Sign up.</p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Home;
