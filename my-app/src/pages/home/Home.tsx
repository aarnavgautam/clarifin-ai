import React, { useState } from 'react';
import './Home.css';
import purpleLogo from '../../assets/clarifina.png';
import { auth, db } from '../../firebaseConfig/firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate} from 'react-router-dom';

const Home: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  // const [isLogin, setIsLogin] = useState(true);
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      // Successful login, you can get user data from userCredential.user
      console.log('Login successful:', userCredential);
      localStorage.setItem('user', JSON.stringify(userCredential.user)); // Save user data to localStorage
      navigate("/welcome", {state: {uid: userCredential.user.uid}});
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Please check your username and password.');
    }
  };

  const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default button action
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      // Successful sign-up, user is automatically logged in
      console.log('Sign-up successful:', userCredential.user);
      alert('Sign-up successful! You can now log in.');
    
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username: userCredential.user.email,
      });
      alert('Sign up successful! You can now log in.');
    } catch (error) {
      console.error('Sign-up failed', error);
      alert('Sign-up failed. Please try again.');
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
              <button onClick={handleSignUp} type="button">Sign up</button>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
export default Home;
