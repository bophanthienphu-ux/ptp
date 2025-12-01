const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/vid', (req, res) => {
    // Lấy URL từ body của request JSON
    videoUrl = 'https://phu-nine.vercel.app/api/download/?url='+req.query.url

    if (!videoUrl) {
        return res.status(400).send('Thiếu URL video trong body request.');
    }

    // Tạo tên tệp ngẫu nhiên/duy nhất và lưu ngay tại thư mục gốc của ứng dụng
    const outputFileName = 'vid.mp4'
    const outputPath = '/tmp/vid.mp4'

     if (fs.existsSync(outputPath)){
    fs.unlinkSync(outputPath)}
         
    
    console.log(`Bắt đầu chuyển đổi video từ URL: ${videoUrl}`);

    ffmpeg('https://phu-nine.vercel.app/api/download/?url='+req.query.url)
        .output(outputPath)
        // Đảm bảo codec là H.264/AAC cho MP4 tương thích
        .videoCodec('copy')
        .outputOptions(['-crf 40','-preset veryfast','-tune fastdecode'])
        .on('end', () => {
            console.log(`Chuyển đổi hoàn tất: ${outputPath}`);
            
            // --- THAY THẾ res.download() bằng res.sendFile() ---
            // Trình duyệt có thể sẽ hiển thị trình phát video thay vì tải xuống
            res.sendFile(outputPath, (err) => {
                if (err) {
                    console.error("Lỗi khi gửi tệp:", err);
                    // Nếu đã gửi headers rồi thì không thể gửi lỗi 500 nữa
                }
                
                // Dọn dẹp tệp đã chuyển đổi sau khi gửi xong (trong callback của sendFile)
                fs.unlink(outputPath, (err) => {
                    if (err) console.error("Lỗi khi xóa tệp tạm:", err);
                    console.log(`Đã xóa tệp tạm: ${outputPath}`);
                });
            });
        })
        .on('error', (err) => {
            console.error('Lỗi FFmpeg:', err.message);
            // Nếu lỗi xảy ra trước khi gửi tệp
            if (!res.headersSent) {
               res.status(500).send(`Lỗi trong quá trình chuyển đổi: ${err.message}`);
            }
        })
        .run();
});

app.listen(PORT, () => {
    console.log(`Server Express đang lắng nghe tại http://localhost:${PORT}`);
});
