const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const https = require('https');
const { exec } = require('child_process');
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
    const destinationPath = '/tmp/vid_tmp.mp4'; // Adjust as neede
    if (fs.existsSync(destinationPath)){
                        fs.unlinkSync(destinationPath)
    }
    const file = fs.createWriteStream(destinationPath);

  https.get(videoUrl, function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close(); // Close the file stream
    console.log('File downloaded successfully!');
    const outputFileName = 'vid.mp4'
    const outputPath = '/tmp/vid.mp4'
         
    
    console.log(`Bắt đầu chuyển đổi video từ URL: ${videoUrl}`);

    ffmpeg('/tmp/.vid_tmp.mp4')
        .output(outputPath)
        // Đảm bảo codec là H.264/AAC cho MP4 tương thích
        .videoCodec('copy')
        .outputOptions(['-crf 40','-preset veryfast','-tune fastdecode'])
        .on('end', () => {
            console.log(`Chuyển đổi hoàn tất: ${outputPath}`);
            const videoPath = outputPath; // Adjust path to your video
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            const videoStream = fs.createReadStream(videoPath, { start, end });
            videoStream.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
                
                
    exec('ls -la /tmp', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
                // Dọn dẹp tệp đã chuyển đổi sau khi gửi xong (trong callback của sendFile)
                if (fs.existsSync(outputPath)){
                fs.unlink(outputPath, (err) => {
                    if (err) console.error("Lỗi khi xóa tệp tạm:", err);
                    console.log(`Đã xóa tệp tạm: ${outputPath}`);
                });
                };
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
}).on('error', function(err) { // Handle errors
  fs.unlink(destinationPath, () => {}); // Delete the file if an error occurred
  console.error('Error downloading file:', err.message);
});
    // Tạo tên tệp ngẫu nhiên/duy nhất và lưu ngay tại thư mục gốc của ứng dụng
});

app.listen(PORT, () => {
    console.log(`Server Express đang lắng nghe tại http://localhost:${PORT}`);
});
