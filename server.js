

const express = require('express');
        const app = express();
        const cors = require('cors')
            const { exec,spawn } = require('child_process');   
            const axios = require('axios');
            const fs = require('fs');
            const path = require('path');
            const YTDlpWrap = require('yt-dlp-wrap').default;
        const PORT = 3000; // You can choose any available port

        // Define a simple route for the root URL
        app.get('/', (req, res) => {
            let ytDlpEventEmitter = ytDlpWrap
    .exec([
        'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        '-f',
        'best',
        '-o',
        'output.mp4',
    ])
    .on('progress', (progress) =>
        console.log(
            progress.percent,
            progress.totalSize,
            progress.currentSpeed,
            progress.eta
        )
    )
    .on('ytDlpEvent', (eventType, eventData) =>
        console.log(eventType, eventData)
    )
    .on('error', (error) => console.error(error))
    .on('close', () => console.log('all done'));

res.status(200).send(ytDlpEventEmitter.ytDlpProcess.pid);
            })
        });

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });