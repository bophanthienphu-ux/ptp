const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const app = express();
const https = require('https');
const fs = require('fs');
const port = 3000;

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

    // 2. Set response headers for a video file download
    res.setHeader('Content-Type', 'video/mp4'); // MIME type for .avi (adjust based on output format)
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
            .videoCodec('libx264') // Convert to AVI format (example)
            .on('error', (err) => {
                console.error('FFmpeg error:', err.message);
                if (!res.headersSent) {
                   res.status(500).send('Video conversion failed');
                }
            })
            .on('end', () => {
                console.log('Conversion finished and streamed to client');
            })
            .output(res, { end: true });
  });

  file.on('error', (err) => {
    fs.unlink(localFilePath, () => {}); // Delete the file if an error occurs during writing
    console.error('Error writing file:', err);
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
