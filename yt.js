const PORT = process.env.PORT || 5001;
        const express = require('express');
            const app = express();
            const cors = require('cors')
            const { exec,spawn } = require('child_process');   
            const axios = require('axios');
            const fs = require('fs');
            const path = require('path');
            const { Client } = require("basic-ftp");                                                                                                                                                                                                                                                                                                                                                                                                                                                  
const { urlencoded } = require('express');
            const m3u8stream = require('m3u8stream')
            app.use(cors())
            app.use(express.urlencoded({ extended: true })); 
                app.get('/get', (req, res) => {
                res.send('hi')
                          });
                app.post('/post', (req, res) => {
                    
                    var username= req.body.username
                    var url = req.body.url
                    exec('yt-dlp --get-url '+url+' -f best/bestvideo+bestaudio', (error, stdout, stderr) => {
                              if (error) {
                                      console.error(`Error: ${error.message}`);
                                              return;
                                                    }
                                                          res.status(200).send(`${stdout}`);
                                                                    });
                    })                                                                                                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                                                                                             
                    app.get('/ftp', (req,res) =>{
                        if (fs.existsSync('/home/user/public/action/action.txt')){
                        fs.unlinkSync('/home/user/public/action/action.txt')
                        }
                        example()

                      
                        async function example() {
                            const client = new Client()
                                client.ftp.verbose = true
                                    try {
                                            await client.access({
                                                        host: "ftpupload.net",
                                                                    user: "if0_39814965",
                                                                                password: "phanthienphu10",
                                                  
                                                                                            secure: true
                                                                                                    })
                                                                                                          await client.cd('/phanthienphu.page.gd/htdocs/action/');res.status(200).send(await client.list());await client.downloadTo(fs.createWriteStream('/home/user/public/action/action.txt'),'action.txt')
                                                                                                                                }
                                                                                                                                    catch(err) {
                                                                                                                                            console.log(err+'202')
                                                                                                                                                }
                                                                                                                                                    client.close()
                                                                                                                                                    }
                    app.use(cors())                                                                                                             })
                    app.get('/yt-get',(req,res) =>{
                    
                    fs.readFile('/home/user/public/action/action.txt', 'utf-8', (err, data) => {exec('yt-dlp --cookies /home/user/public/cookies.txt --extractor-args "youtube:skip=hls" -g '+data,(error, stdout, stderr) =>{   
                                                        res.status(200).send(`${stdout}`);console.log(data); console.log(stdout);console.log(stderr)
                        })
                })
        });
                    
                    app.get('/ls',(req,res)=>{
                        exec('ls /', (error, stdout, stderr) => {
                                        if (error) {
                                                    console.error(`exec error: ${error}`);
                                                                return;
                                                                        }
                                                                                res.send(`${stdout}`);
                                                                                        console.error(`stderr: ${stderr}`);
                                                                });})
                     app.use(cors())
                     app.get('/yt-con',(req,res)=>{
                     if (fs.existsSync('/home/user/public/vid/output.webm')){fs.unlinkSync('/home/user/public/vid/output.webm')}

                        res.status(200).send('hi')
                     const child = exec('ffmpeg -i /home/user/public/vid/vid.mp4 -tune film -c:v libx264 -crf 23 -c:a aac -preset medium /home/user/public/vid/output.mp4'); // Example: list files in root directory

                     child.stdout.on('data', (data) => {
                         console.log(data)
                         });

                         child.stderr.on('data', (data) => {
                           });

                           child.on('close', (code) => {
                             console.log(`Child process exited with code ${code}`);
                             });

                             child.on('error', (err) => {
                               console.error('Failed to start child process:', err);
                               });
                     });
                     

                                     app.get('/yt-stream', (req, res) => {
                                        
                                             var filePath = '/home/user/public/vid/vid.webm'

                                                     // Check if the file exists (optional but recommended)
                                                             if (!fs.existsSync(filePath)) {
                                                                         return res.status(404).send('File not found');
                                                                                 }

                                                                                         // Set appropriate headers for the file type and disposition
                                                                                                 res.setHeader('Content-Type', 'video/webm'); // Adjust content-type based on your file
                                                                                         // For download, use 'attachment'

                                                                                                                 // Create a readable stream from the file
                                                                                                                         const fileStream = fs.createReadStream(filePath);

                                                                                                                                 // Pipe the file stream to the response object
                                                                                                                                         fileStream.pipe(res);

                                                                                                                                                 // Handle potential errors during streaming
                                                                                                                                                         fileStream.on('error', (err) => {
                                                                                                                                                                     console.error('Error streaming file:', err);
                                                                                                                                                                                 res.status(500).send('Error streaming file');
                                                                                                                                                                                         });})
                                                                                                                                                                                             

                                     app.post('/yt-cre-dump', (req, res) => {
                                                const filePath = '/home/user/public/vid/txt.txt'; // Path to the file you want to create
                                                        const fileContent = req.body.name

                                                                fs.writeFile(filePath, fileContent, (err) => {
                                                                            if (err) {
                                                                                            console.error('Error creating file:', err);
                                                                                                            return res.status(500).send('Error creating file.');
                                                                                                                        }
                                                                                                                                    console.log('File created successfully!');
                                                                                                                                                res.send('File created successfully!');
                                                                                                                                                        });
                                    app.use(express.urlencoded({ extended: true }));                                                                                                        });
                                     app.post('/yt-op', (req, res) => {
                                        
                                          exec('yt-dlp --cookies /home/user/public/cookies.txt -F https://youtu.be/YG4iTGjuoKw?si=piERsQz9jbf-pT6h', (error, stdout,stderr) => {
                                              if (error) {
                                                    console.error(`exec error: ${error}`);
                                                          return res.status(500).send(`Error: ${error.message}`);
                                                              }
                                                        
                                                                                      res.send(`Output:\n${stdout}`);
                                     })})
                                     app.post('/test', (req, res) => {
                                                const postData = req.body
                                                        console.log('Received POST data:', postData);
                                                                res.send('Data received successfully!');
                                                                    });
                                        app.get('/ftp_1',(req,res)=>{
                                        if (fs.existsSync('/home/user/public/action/url.txt')){fs.unlinkSync('/home/user/public/action/url.txt')}
                                        example()

                                        async function example() {
                                            const client = new Client()
                                                client.ftp.verbose = true
                                                    try {
                                                            await client.access({
                                                                        host: "ftpupload.net",
                                                                                    user: "if0_39814965",
                                                                                                password: "phanthienphu10",
                                                                                                            secure: true
                                                                                                                    })
                                                                                                                            res.status(200).send(await client.list())
                                                                                                                                    await client.cd('/phanthienphu.page.gd/htdocs/action/')
                                                                                                                                            await client.downloadTo(fs.createWriteStream('/home/user/public/action/url.txt'),'url.txt')
                                                                                                                                                }
                                                                                                                                                    catch(err) {
                                                                                                                                                            console.log(err)
                                                                                                                                                                }
                                                                                                                                                                    client.close()
                                                                                                                                                                    }
                                        })
                                        app.get('/yt-pro',(req,res)=>{
                                        if (fs.existsSync('/home/user/public/vid/vid.webm')){fs.unlinkSync('/home/user/public/vid/vid.webm')}
                                        exec('ffmpeg -i ftp://if0_39814965:phanthienphu10@ftpupload.net/phanthienphu.page.gd/htdocs/action/vid.temp.mp4 -i ftp://if0_39814965:phanthienphu10@ftpupload.net/phanthienphu.page.gd/htdocs/action/aud.temp.mp3 -c:a libopus -c:v libvpx-vp9 -crf 0 -map 0:v:0 -map 1:a:0 /home/user/public/vid/vid.webm')
                                        res.status(200).send('hi')
                                        })
                                        app.use(express.static('/home/user/public/vid'));
                    app.listen(PORT, () => {
        console.log(`Server is listening at http://localhost:${PORT}`);
    });