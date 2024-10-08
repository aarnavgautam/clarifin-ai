import React, { useState } from 'react';
import './Home.css';
import purpleLogo from '../../assets/clarifina.png';
import { auth } from '../../firebaseConfig/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      // Successful login, you can get user data from userCredential.user
      console.log('Login successful:', userCredential);
      localStorage.setItem('user', JSON.stringify(userCredential.user)); // Save user data to localStorage
      if (isSignUp) {
        navigate('/welcome', { state: { uid: userCredential.user.uid } } );
      } else {
        navigate('/profile', { state: { uid: userCredential.user.uid } });
      }
      // navigate("/profile", { state: { uid: userCredential.user.uid } }); // Navigate to profile page
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Please check your username and password.');
    }
  };

  return (
    <section className="home_container animated_background">
      <div className="home_content">
        <div className="home_title">
          <img src={purpleLogo} className="home_logo" alt="Logo" />
          <h2>Clarifying financial documents, together.</h2>
        </div>
        <div className="home_login">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="home_option">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
            <p>Don't have an account? 
              <span 
                className="signUp"
                onClick={() => navigate("/welcome")} // Navigate to the User Information screen
                style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Sign up
              </span>.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Home;
