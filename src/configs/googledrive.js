const apikey = require('./googleapikey.json')
const {google} = require('googleapis');
const stream = require('stream');
const { Readable } = require('stream');
const path = require("path");
const SCOPE = ['https://www.googleapis.com/auth/drive'];

const keypath = path.join(__dirname, '/googleapikey.json');

const auth = new google.auth.GoogleAuth({
    keyFile: keypath,
    scopes: SCOPE,
});

const uploadFile = async (file) => {
    try {
        if (!file.buffer || file.buffer.length === 0) {
            console.error("File buffer is empty.");
            return null;
        }
        const bufferStream = Readable.from(file.buffer);
        bufferStream.on('data', (chunk) => {
            console.log(`Uploading chunk of size: ${chunk.length}`);
        });
        const { data } = await google.drive({ version: "v3", auth }).files.create({
            media: {
                mimeType: file.mimeType,
                body: bufferStream,
            },
            requestBody: {
                name: file.originalname,
                parents: ["1LokoftUePwXLFyB1rnypLMEHo9X1Gnso"],
            },
            fields: "id,name",
        });
        console.log(`Uploaded file ${data.name} ${data.id}`);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const downloadFile = async (fileId) => {
    try {
        const drive = google.drive({ version: 'v3', auth });
        const res = await drive.files.get({
            fileId: fileId,
            alt: 'media'
        }, { responseType: 'stream' });
        return res.data; // This should be a readable stream
    } catch (error) {
        console.error("Error downloading file:", error);
        return null;
    }
};


module.exports = {
    uploadFile,
    downloadFile
};
