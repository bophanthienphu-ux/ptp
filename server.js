const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const http = require('https'); // Use 'https' for HTTPS URLs
const fs = require('fs');

const app = express();
const PORT = 3000;

ffmpeg.setFfmpegPath(ffmpegStatic);

// Đặt URL video nguồn cố định tại đây
const SOURCE_VIDEO_URL = "https://phu-nine.vercel.app/api/download/?url=https://youtu.be/1bZtCt_Siro?si=i2NQWnKbYqmMK7Ud";
// THAY THẾ URL MẪU TRÊN BẰNG LIÊN KẾT VIDEO THỰC TẾ CỦA BẠN

app.get('/vid', (req, res) => {
const destinationPath = '/tmp/vid.mp4'; // Replace with your desired local path and filename

const fileStream = fs.createWriteStream(destinationPath);

http.get(SOURCE_VIDEO_URL, (response) => {
    // Handle HTTP errors
    if (response.statusCode >= 400) {
        console.error(`Error downloading file: ${response.statusCode} - ${response.statusMessage}`);
        fs.unlink(destinationPath, () => {}); // Clean up partially downloaded file
        return;
    }

    // Pipe the response stream to the file write stream
    response.pipe(fileStream);

    fileStream.on('finish', () => {
        fileStream.close(() => {
            console.log('File downloaded successfully!');
            console.log(`Starting conversion for specific URL: ${SOURCE_VIDEO_URL}`);

            res.set({
            'Content-Type': 'video/mp4',
            });
            const command = ffmpeg('/tmp/vid.mp4')
        .toFormat('mp4')
        .videoCodec('libx264')
        .audioCodec('aac')
        // Thêm tùy chọn để cải thiện khả năng tương thích khi streaming đến pipe
        .outputOptions(['-movflags frag_keyframe+empty_moov'])
        .on('start', (commandLine) => {
            console.log('Spawned Ffmpeg command: ' + commandLine);
        })
        .on('error', (err, stdout, stderr) => {
            console.error('An error occurred: ' + err.message);
            // **QUAN TRỌNG: Log stdout và stderr để xem thông báo lỗi chi tiết từ FFmpeg**
            console.error('FFmpeg stdout:\n' + stdout); 
            console.error('FFmpeg stderr:\n' + stderr); 

            if (!res.headersSent) {
                res.status(500).send('Video conversion failed. Check server logs for details.');
            }
        })
        .on('end', () => {
            console.log('Conversion finished and stream closed');
        });

    // Bắt đầu piping
    command.pipe(res, { end: true });
});
        });
    });
}).on('error', (err) => {
    // Handle network errors
    console.error('Error during download:', err.message);
    fs.unlink(destinationPath, () => {}); // Clean up in case of network error
});  
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
