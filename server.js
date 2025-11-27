const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

const app = express();
const PORT = 3000;

// Chỉ định đường dẫn đến binary FFmpeg tĩnh
ffmpeg.setFfmpegPath(ffmpegStatic);

// Đặt URL video nguồn cố định tại đây
const SOURCE_VIDEO_URL = "https://phu-nine.vercel.app/api/download/?url=https://youtu.be/1bZtCt_Siro?si=i2NQWnKbYqmMK7Ud";
// Thay thế URL mẫu trên bằng liên kết video thực tế của bạn

// Sử dụng phương thức GET để truy cập trực tiếp việc chuyển đổi
app.get('/vid', (req, res) => {
    console.log(`Starting conversion for specific URL: ${SOURCE_VIDEO_URL}`);

    // Đặt header cho phản hồi để trình duyệt biết đây là tệp MP4 có thể tải xuống
    res.set({
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="specific_converted_video.mp4"'
    });

    ffmpeg(SOURCE_VIDEO_URL) // Truyền trực tiếp URL cố định làm nguồn đầu vào
        .toFormat('mp4')
        .videoCodec('libx264') // Sử dụng codec h264
        .audioCodec('aac')    // Sử dụng codec AAC
        .outputOptions('-crf 23')
        .on('start', (commandLine) => {
            console.log('Spawned Ffmpeg command: ' + commandLine);
        })
        .on('error', (err, stdout, stderr) => {
            console.error('An error occurred: ' + err.message);
            if (!res.headersSent) {
                res.status(500).send('Video conversion failed.');
            }
        })
        .on('end', () => {
            console.log('Conversion finished and stream closed');
        })
        .pipe(res, { end: true }); // Chuyển luồng đầu ra trực tiếp đến phản hồi Express
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
