import React from 'react';
import './Home.css';

import logo from '../../assets/clarifina.png';

const Home = () => {
  
  const handleLogin = () => {
    window.location.href = `https://clarifin-ai.auth.us-east-2.amazoncognito.com/login?response_type=code&client_id=mhhtn5j6b2l87ga35v81m4khh&redirect_uri=http://localhost:3000/user-information`;
  };
  return (
    <section className="home_container animated_background">
      <div className="home_content">
        <div className="home_title">
          <img src={logo} className="home_logo" alt="Logo" />
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
            <button onClick = {handleLogin}>Login</button>
            <p>Don't have an account? Sign up.</p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Home;
