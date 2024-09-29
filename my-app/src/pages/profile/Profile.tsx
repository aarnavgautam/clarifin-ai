import React, {useState, useEffect} from 'react';
import { storage, auth } from '../../firebaseConfig/firebase.js';
import { ref, uploadBytesResumable, getDownloadURL, listAll, getBlob } from 'firebase/storage';

const Profile: React.FC = () => {
  const [documents, setDocuments] = useState<File[] >([]);
  const [progress, setProgress] = useState<number>(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  useEffect(() => {
    
    const fetchDocuments = async() => {
      if (auth.currentUser != null){

        const folderRef = ref(storage, `documents/${auth.currentUser.uid}`)

        try {
          const res = await listAll(folderRef);
          const fileArray: File[] = [];
    
          await Promise.all(
            res.items.map(async (itemRef) => {

              const blob = await getBlob(itemRef);
              const file = new File([blob], itemRef.name, { type: blob.type });
              fileArray.push(file);

            })
          );
    
          setDocuments(fileArray);
        } 
        catch (error) {
          console.error("Error listing files:", error);
        }

      }

      fetchDocuments();
    }
    
   
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && auth.currentUser != null) {
      const selectedFile = e.target.files[0];

      if (selectedFile.type === "application/pdf") {
        
        const storageRef = ref(storage, `documents/${auth.currentUser.uid}/${selectedFile.name}`);

        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Error uploading file:", error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setDownloadURL(url);
            console.log("File available at", url);
          }
        );

      } 
      else {
        alert("Please select a PDF file.");
      }
    }

  }

  return (
    <>
      <div className="profile_documents_preview">
        <input type="file" onChange={handleFileUpload}></input>
        {documents.map((doc, ind) => (
        <div key={ind}>
          <h3>{doc.name}</h3>
        </div>
      ))}
      </div>
      
    </>
  )
}

export default Profile