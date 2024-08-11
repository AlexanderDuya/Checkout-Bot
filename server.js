const express = require('express');
const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');
const path = require('path');

const app = express();
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'check-proxies.html'));
});

// Handle proxy checking
app.post('/check-proxies', async (req, res) => {
    const { proxies } = req.body;
    const results = [];

    for (const proxy of proxies) {
        let agent;
        try {
            // Validate the proxy format
            if (!/^http:\/\/[^\s]+$/.test(proxy)) {
                throw new Error('Invalid proxy format');
            }

            agent = new HttpsProxyAgent(proxy);
            const startTime = Date.now();

            await axios.get('https://www.google.com', { httpsAgent: agent });
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;
            results.push({ proxy, speed: `${duration.toFixed(2)} seconds`, status: 'OK' });
        } catch (error) {
            results.push({ proxy, speed: null, status: `Error: ${error.message}` });
        }
    }

    res.json(results);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
