

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
            exec('pkg install yt-dlp')
            res.status(200).send('hi')
        })

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });