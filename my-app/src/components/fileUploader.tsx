// import functions and use within component
import { uploadFile, processFile } from '../services/fileUploadService';
import React, { useState, useEffect, useRef } from 'react';
import { Worker, Viewer, PdfJs } from '@react-pdf-viewer/core';
import { highlightPlugin } from '@react-pdf-viewer/highlight';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

const FileUploader: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null); // URL of the uploaded PDF
    const [highlights, setHighlights] = useState<any[] >([]);

    const highlightPluginInstance = highlightPlugin();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setPdfUrl(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleUploadAndProcess = async () => {
        if (file) {
            await uploadFile(file);
            const extractedData = await processFile(file.name);
            console.log('Extracted Data:', extractedData);

            extractedData.forEach((line: any) => {
                setHighlights((prevHighlights) => [
                    ...prevHighlights, 
                    {
                        content: line.text,
                        pageIndex: line.page - 1,
                        position: {
                            top: `${line.boundingBox.Top * 100}%`,  // Convert relative position
                            left: `${line.boundingBox.Left * 100}%`,  // Convert relative position
                            width: `${line.boundingBox.Width * 100}%`,
                            height: `${line.boundingBox.Height * 100}%`,
                        },
                    },
                ]);
            });

            console.log(highlights.length);
        }
    };

    const handleHighlightClick = (highlight: any) => {
        alert(`Clicked on: ${highlight.content}`);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUploadAndProcess}>Upload and Process</button>

            {/* Display PDF only when a file is uploaded */}
            {pdfUrl && (
                <div style={{ width: '500px', height: '500px', marginTop: '20px', position: 'relative' }}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer
                            fileUrl={pdfUrl}
                            plugins={[highlightPluginInstance]}
                            renderPage={(props) => {
                                props.markRendered(props.pageIndex);
                                return (
                                <div key={props.pageIndex} >
                                    
                                    <div
                                        style={{
                                            zIndex: 1, /* Ensure canvas is rendered beneath */
                                            pointerEvents: 'none', /* Prevent canvas from intercepting clicks */
                                        }}
                                    >
                                        {props.canvasLayer.children}
                                    </div>

                                    {/* Render highlights for the current page */}
                                    {highlights
                                        .filter((h) => h.pageIndex === props.pageIndex)
                                        .map((highlight, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleHighlightClick(highlight)}
                                            style={{
                                                position: 'absolute',
                                                zIndex: 10,
                                                top: highlight.position.top,
                                                left: highlight.position.left,
                                                width: highlight.position.width,
                                                height: highlight.position.height,
                                                backgroundColor: 'rgba(255, 255, 0, 0.5)', // Yellow highlight
                                                cursor: 'pointer',
                                            }}
                                        />
                                    ))}
                                </div>
                            )}}
                        />
                    </Worker>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
