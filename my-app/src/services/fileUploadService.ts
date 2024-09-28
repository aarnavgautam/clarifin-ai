// upload files from the client to the server via AWS
// using a lambda function that is triggered by an S3 bucket

export async function getPresignedUrl(fileName: string): Promise<string> {
    const response = await fetch(`https://4a2iccwg2kc65mx5n6loeserda0msolk.lambda-url.us-east-2.on.aws/?action=upload&fileName=${fileName}`);
    const data = await response.json();
    return data.uploadUrl;
}

export async function uploadFile(file: File): Promise<void> {
    const uploadUrl = await getPresignedUrl(file.name);
    await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': 'file.type',
        },
    });
}

export async function processFile(fileName: string): Promise<any> {
    const response = await fetch('https://4a2iccwg2kc65mx5n6loeserda0msolk.lambda-url.us-east-2.on.aws/?action=process&fileName=${fileName}');
    return await response.json();
}