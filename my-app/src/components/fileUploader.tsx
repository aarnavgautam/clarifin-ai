// import functions and use within component
import React, { useState } from 'react';
import { uploadFile, processFile } from '../services/fileUploadService';

const FileUploader: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUploadAndProcess = async () => {
        if (file) {
            await uploadFile(file);
            const extractedData = await processFile(file.name);
            console.log('Extracted Data:', extractedData);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUploadAndProcess}>Upload and Process</button>
        </div>
    );
};

export default FileUploader;
