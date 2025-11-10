

const express = require('express');
        const app = express();
        const cors = require('cors')
            const { exec,spawn } = require('child_process');   
            const axios = require('axios');
            const fs = require('fs');
            const path = require('path');
        const PORT = 3000; // You can choose any available port

        // Define a simple route for the root URL
        app.get('/', (req, res) => {
            exec('yt-dlp https://youtu.be/YG4iTGjuoKw?si=piERsQz9jbf-pT6h',(stdout)=>{res.status(200).send(stdout);console.log(stdout)})
        })

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });