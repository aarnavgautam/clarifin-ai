import React, { useState, useEffect } from 'react';
import { storage, auth } from '../../firebaseConfig/firebase.js';
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { useNavigate, useLocation } from 'react-router-dom';

const Profile: React.FC = () => {
  const [documents, setDocuments] = useState<string[]>([]); 
  const [progress, setProgress] = useState<number>(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchDocuments = async () => {
    if (auth.currentUser) {
      const folderRef = ref(storage, `documents/${auth.currentUser.uid}`);

      try {
        const res = await listAll(folderRef);
        const urls = await Promise.all(
          res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return url;
          })
        );

        setDocuments(urls); 
        console.log(urls);
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

            await fetchDocuments();

            navigate('/Document', { state: { downloadURL: url, uid: location.state.uid } });
          }
        );
      } else {
        alert('Please select a PDF file.');
      }
    }
  };

  return (
    <>
      <div className="profile_documents_preview">
        <input type="file" onChange={handleFileUpload} />
        {progress > 0 && <p>Upload progress: {progress}%</p>}
        {documents.length > 0 ? (
          documents.map((doc, ind) => (
            <div key={ind}>
              <a href={doc} target="_blank" rel="noopener noreferrer">
                <h3>PDF {ind + 1}</h3>
              </a>
            </div>
          ))
        ) : (
          <p>No documents uploaded yet.</p>
        )}
      </div>
    </>
  );
};

export default Profile;
