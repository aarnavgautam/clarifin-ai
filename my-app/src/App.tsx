import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

// importing pages
import Home from './pages/home/Home';
import Welcome from './pages/welcome/Welcome';
import UserInformation from './pages/user_information/User';
import Profile from './pages/profile/Profile';
import Document from './pages/document_reader/Document';
import FileUploader from './components/fileUploader';
import Chatbot from './components/chatbot';

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
          <Route path="/file-uploader" element={<FileUploader />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
