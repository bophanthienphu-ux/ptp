

const express = require('express');
        const app = express();
        const cors = require('cors')
            const { exec,spawn } = require('child_process');   
            const axios = require('axios');
            const fs = require('fs');
            const path = require('path');
        const PORT = 3000; // You can choose any available port
         app.use(express.json());
         app.use(cors())

        // Define a simple route for the root URL
        app.get('/ls',(req,res)=>{
            exec('ls /home/render',(stdout)=>{
                res.status(200).send(`${stdout}`);console.log(stdout)
            })
        })
        app.get('/', (req, res) => {
            exec('yt-dlp --cookies cookies.txt https://youtu.be/YG4iTGjuoKw?si=piERsQz9jbf-pT6h',(stdout)=>{console.log(stdout)})
            res.status(200).send('hi')
        })

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });