const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const ftp = require("basic-ftp");
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

app.get('/vid', (req, res) => {
  const inputHlsUrl = req.query.url
const outputMp4Path = '/tmp/output_video.mp4';

// Ensure the ffmpeg path is set if it's not in your system's PATH
// ffmpeg.setFfmpegPath('/path/to/your/ffmpeg/executable'); 

ffmpeg(inputHlsUrl)
  // Use 'copy' for video and audio codecs to avoid re-encoding, which is fast
  .videoCodec('copy')
  .audioCodec('copy')
  
  // This filter is often needed for AAC audio within an HLS stream when converting to MP4
  .outputOptions([
    '-bsf:a aac_adtstoasc' 
  ])

  // Specify the output file path and format
  .save(outputMp4Path)

  // Event handlers for monitoring the process
  .on('start', function(commandLine) {
    console.log('Spawned Ffmpeg command: ' + commandLine);
  })
  .on('progress', function(progress) {
    console.log('Processing: ' + progress.percent + '% done');
  })
  .on('end', function() {
    console.log('Finished processing! MP4 file created at: ' + outputMp4Path);
  })
  .on('error', function(err, stdout, stderr) {
    console.error('An error occurred: ' + err.message);
    console.error('ffmpeg stdout: ' + stdout);
    console.error('ffmpeg stderr: ' + stderr);
  });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
