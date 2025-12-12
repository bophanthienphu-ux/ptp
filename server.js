const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const ftp = require("basic-ftp");
const app = express();
const https = require('https');
const fs = require('fs');
const port = 3000;

async function uploadFileToFtp(localFilePath, remoteFilePath) {
    const client = new ftp.Client();
    // Enable verbose logging for debugging if needed
    // client.ftp.verbose = true; 

    try {
        // Connect to the FTP server
        await client.access({
            host: "ftpupload.net", // Replace with your FTP server host
            user: "if0_39814965",         // Replace with your FTP username
            password: "phanthienphu10",     // Replace with your FTP password
            secure: true              // Use FTPS (FTP over TLS) for security
        });
        console.log("Connected to FTP server successfully.");

        // Upload the file from a readable stream or local path
        // The first argument is the source, the second is the destination on the server
        await client.uploadFrom(localFilePath, remoteFilePath);
        console.log(`Successfully uploaded ${localFilePath} to ${remoteFilePath}.`);
        res.status(200).send('hi')
    } catch (err) {
        console.error("FTP operation failed:", err);
    } finally {
        // Close the connection
        client.close();
        console.log("Disconnected from FTP server.");
    }
}
                                
// Ensure ffmpeg path is set if not in system PATH
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath); 

app.get('/', (req, res) => {
    res.send('Welcome to the video converter service. Use the /convert endpoint.');
});

app.get('/vid', async (req, res) => {
    // 1. Get the source video URL from query parameter
    const videoUrl = 'https://phu-nine.vercel.app/api/download/?url='+req.query.url; 
    if (!videoUrl) {
        return res.status(400).send('Missing video URL query parameter (e.g., ?url=http://example.com/video.mp4)');
    }
    if (fs.existsSync('/tmp/vid_1.mp4')) {
    fs.unlinkSync('/tmp/vid_1.mp4')
    }
    if (fs.existsSync('/tmp/vid.mp4')) {
    fs.unlinkSync('/tmp/vid.mp4')
    }
    // 2. Set response headers for a video file download
     // MIME type for .avi (adjust based on output format)
    // Note: Streaming dynamically generated content means content-length is unknown beforehand

    try {
        // 3. Download the video as a stream using axios
        const file = fs.createWriteStream('/tmp/vid.mp4');

https.get(videoUrl, (response) => {
  response.pipe(file); // Pipe the response stream directly to the file stream

  file.on('finish', () => {
    file.close(); // Close the file stream when writing is complete
    console.log('File downloaded');
      ffmpeg('/tmp/vid.mp4') // Input is the stream from axios
            .videoCodec('copy') // Convert to AVI format (example)
            .output('/tmp/vid_1.mp4')
            .on('error', (err) => {
                console.error('FFmpeg error:', err.message);
                if (!res.headersSent) {
                   res.status(500).send('Video conversion failed');
                }
            })
            .on('end', () => {
                console.log('Conversion finished and streamed to client');
                // --- Usage Example ---
                uploadFileToFtp('/tmp/vid_1.mp4', '/phanthienphu.page.gd/htdocs/action/vid.converted.mp4');
            })
            .run();
  });
}).on('error', (err) => {
  console.error('Error downloading file:', err);
});
        // 4. Pipe the incoming video stream through FFmpeg for conversion and directly to the response
         // Pipe the output directly to the Express response stre
    } catch (error) {
        console.error('Download or streaming error:', error.message);
        if (!res.headersSent) {
            res.status(500).send('Failed to download source video or an internal error occurred.');
        }
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
