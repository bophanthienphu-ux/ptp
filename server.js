const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

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
        'Content-Disposition': 'attachment; filename="specific_converted_video.mp4"'
    });

    const command = ffmpeg(SOURCE_VIDEO_URL)
        .toFormat('mp4')
        .videoCodec('libx264')
        .audioCodec('aac')
        // Thêm tùy chọn để cải thiện khả năng tương thích khi streaming đến pipe
        .outputOptions(['-movflags frag_keyframe+empty_moov','-crf 23','-shortest'])
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
