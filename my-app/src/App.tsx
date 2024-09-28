import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

// importing pages
import Home from './components/home/Home';
import Welcome from './components/welcome/Welcome';
import UserInformation from './components/user_information/User';
import Profile from './components/profile/Profile';
import Document from './components/document_reader/Document';


const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/user-information" element={<UserInformation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/document" element={<Document />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
