const apiURL = 'https://byu5drlxzd.execute-api.us-east-2.amazonaws.com/dev';

export async function getPresignedUrl(fileName: string): Promise<string> {
    try {
        const response = await fetch(`${apiURL}/upload?fileName=${fileName}&action=upload`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Log the raw response for debugging
        const rawResponse = await response.text();
        console.log('Raw response:', rawResponse); // Add this for debugging

        if (!response.ok) {
            throw new Error(`Failed to get presigned URL: ${response.statusText}`);
        }

        const data = JSON.parse(rawResponse); // Parse the raw response
        return data.uploadUrl;
    } catch (error) {
        console.error('Error fetching presigned URL:', error);
        throw error; // Re-throw the error so it can be handled upstream
    }
}


export async function uploadFile(file: File): Promise<void> {
    const supportedFormats = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff'];

    if (!supportedFormats.includes(file.type)) {
        console.error('Unsupported file format. Only PDF, JPEG, PNG, and TIFF are allowed.');
        alert('Unsupported file format. Please upload a PDF, JPEG, PNG, or TIFF file.');
        return;
    }

    try {
        const uploadUrl = await getPresignedUrl(file.name);
        const response = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type, // Ensure correct content type for file
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to upload file: ${response.statusText}`);
        }
        console.log('File uploaded successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

export async function processFile(fileName: string): Promise<any> {
    try {
        const response = await fetch(`${apiURL}/process?fileName=${fileName}&action=process`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Log the raw response for debugging
        const rawResponse = await response.text();
        console.log('Raw response from Textract process:', rawResponse);

        if (!response.ok) {
            throw new Error(`Failed to process file: ${response.statusText}`);
        }
        return JSON.parse(rawResponse); // Parse the response only after logging
    } catch (error) {
        console.error('Error processing file:', error);
        throw error;
    }
}

