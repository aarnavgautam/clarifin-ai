import React, { useState, useEffect } from 'react';
import { storage, auth } from '../../firebaseConfig/firebase.js';
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { useNavigate, useLocation } from 'react-router-dom';
import './Profile.css';
import logo from '../../assets/clarifina.png';
const Profile: React.FC = () => {
  const [documents, setDocuments] = useState<{ url: string; name: string; file: File | null }[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const fetchDocuments = async () => {
    if (auth.currentUser) {
      const folderRef = ref(storage, `documents/${auth.currentUser.uid}`);
      try {
        const res = await listAll(folderRef);
        const docs = await Promise.all(
          res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return { url, name: itemRef.name, file: null };
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
      <div className="document_container">
        <img src={logo} className="document_logo" alt="Logo" />
        <div className="profile_documents_preview">
          <h1 className="profile_welcome">Welcome back.</h1>
          {/* Upload Section */}
          <h2 className="uploadtxt">Upload a file.</h2>
          <input type="file" onChange={handleFileUpload} className="upload" />
          {progress > 0 && <p>Upload progress: {progress}%</p>}
          {/* Previous Documents Section */}
          <h2 className="uploadtxt">Previous Documents:</h2>
          {documents.length > 0 ? (
            <div className="documents-grid">
              {documents.map((doc, ind) => (
                <div key={ind} className="document-card" onClick={() => handleCardClick(doc.url, doc.name)}>
                  <h3>{doc.name}</h3>
                  <p>Click to view the document</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="noDoc">No previous documents uploaded yet.</p>
          )}
        </div>
      </div>
    </>
  );
};
export default Profile;












