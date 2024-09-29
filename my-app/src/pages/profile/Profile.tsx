import React, { useState, useEffect } from 'react';
import { storage, auth } from '../../firebaseConfig/firebase.js';
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { useNavigate, useLocation } from 'react-router-dom';
import './Profile.css';

import logo from '../../assets/clarifina.png'

const Profile: React.FC = () => {
  const [documents, setDocuments] = useState<{ url: string, name: string }[]>([]); 
  const [progress, setProgress] = useState<number>(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch documents from Firebase Storage
  const fetchDocuments = async () => {
    if (auth.currentUser) {
      const folderRef = ref(storage, `documents/${auth.currentUser.uid}`);
      try {
        const res = await listAll(folderRef);
        const docs = await Promise.all(
          res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const name = itemRef.name; // Extract the file name
            return { url, name }; // Return both the URL and file name
          })
        );

        setDocuments(docs); 
        console.log(docs);
      } catch (error) {
        console.error('Error listing files:', error);
      }
    }
  };

  useEffect(() => {
    fetchDocuments(); 
  }, []);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && auth.currentUser) {
      const selectedFile = e.target.files[0];

      if (selectedFile.type === 'application/pdf') {
        const storageRef = ref(storage, `documents/${auth.currentUser.uid}/${selectedFile.name}`);

        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error('Error uploading file:', error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setDownloadURL(url);
            console.log('File available at', url);

            await fetchDocuments(); // Refresh document list

            navigate('/document', { state: { downloadURL: url, uid: location.state.uid, incomingFile: selectedFile } });
          }
        );
      } else {
        alert('Please select a PDF file.');
      }
    }
  };

  // Handle card click to navigate to the document viewer
  const handleCardClick = async (docUrl: string, docName: string) => {
    try {
      const response = await fetch(docUrl);
      const blob = await response.blob();
      const fileName = docName || "download.pdf";
      const navFile = new File([blob], fileName, { type: 'application/pdf' });
      navigate('/document', { state: { downloadURL: docUrl, uid: location.state.uid, incomingFile: navFile } });;
    }
    catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  };

  return (
    <>
    <section className = "profile_container">
      <div className = "profile_header">

      </div>
      
        <div className="profile_documents_preview">

          <img src = {logo} className = "profileLogo" />

          <input type="file" onChange={handleFileUpload} />
          {progress > 0 && <p>Upload progress: {progress}%</p>}
          {documents.length > 0 ? (
            <div className="documents-grid">
              {documents.map((doc, ind) => (
                <div 
                  key={ind} 
                  className="document-card" 
                  onClick={() => handleCardClick(doc.url, doc.name)}
                >
                  <h3>{doc.name}</h3> {/* Display the document's name as the heading */}
                  <p>Click to view the document</p>
                </div>
              ))}
            </div>
      ) : (
        <p>No documents uploaded yet.</p>
      )}
        </div>
    </section>
     
    </>
  );
};

export default Profile;
