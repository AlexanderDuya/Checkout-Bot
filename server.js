const express = require('express');
const axios = require('axios');
const ProxyAgent = require('proxy-agent'); // Import ProxyAgent
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'check-proxies.html'));
});

app.post('/check-proxies', async (req, res) => {
    const { proxies } = req.body;
    const results = [];

    for (const proxy of proxies) {
        const proxyUrl = proxy.startsWith('http://') ? proxy : `http://${proxy}`;
        const agent = new ProxyAgent(proxyUrl); // Use ProxyAgent

        const startTime = Date.now();
        try {
            await axios.get('https://www.google.com', { httpsAgent: agent });
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;
            results.push({ proxy: proxyUrl, speed: `${duration.toFixed(2)} seconds`, status: 'OK' });
        } catch (error) {
            results.push({ proxy: proxyUrl, speed: null, status: `Error: ${error.message}` });
        }
    }

    res.json(results);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
