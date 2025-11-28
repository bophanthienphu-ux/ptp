const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const fs = require('fs');

const app = express();
const PORT = 3000;

ffmpeg.setFfmpegPath(ffmpegStatic);

// Đặt URL video nguồn cố định tại đây
const SOURCE_VIDEO_URL = "https://phu-nine.vercel.app/api/download/?url=https://youtu.be/1bZtCt_Siro?si=i2NQWnKbYqmMK7Ud";
// THAY THẾ URL MẪU TRÊN BẰNG LIÊN KẾT VIDEO THỰC TẾ CỦA BẠN

app.get('/vid', (req, res) => {
    console.log(`Starting conversion for specific URL: ${SOURCE_VIDEO_URL}`);

    res.set({
        'Content-Type': 'video/mp4',
    });

    ffmpeg(SOURCE_VIDEO_URL)
        .toFormat('mp4')
        .videoCodec('libx264')
        .audioCodec('aac')
        // Tùy chọn QUAN TRỌNG để cho phép streaming MP4 qua pipe
        .outputOptions(['-movflags frag_keyframe+empty_moov','/tmp/vid.mp4'])
        .on('start', (commandLine) => {
            console.log('Spawned Ffmpeg command: ' + commandLine);
        })
        .on('error', (err, stdout, stderr) => {
            console.error('An error occurred: ' + err.message);
            // Log chi tiết lỗi để gỡ lỗi thêm nếu cần
            console.error('FFmpeg stdout:\n' + stdout);
            console.error('FFmpeg stderr:\n' + stderr);

            if (!res.headersSent) {
                res.status(500).send('Video conversion failed. Check server logs for details.');
            }
        })
        .on('end', () => {
            console.log('Conversion finished and stream closed');
        });
         fs.readFile('/tmp/vid.mp4', (err, data) => {
             res.status(200).send(data)
         });
        
    });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
