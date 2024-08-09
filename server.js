const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(, 'views', 'index.html'));
});

// Route to serve the dashboard page
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(nike-raffle.html, 'views', 'dashboard.html'));
});

// Route to serve the check-proxies page
app.get('/check-proxies', (req, res) => {
    res.sendFile(path.join(check-proxies.html, 'views', 'check-proxies.html'));
});

// Route to serve the link-accounts page
app.get('/link-accounts', (req, res) => {
    res.sendFile(path.join(link-accounts.html, 'views', 'link-accounts.html'));
});

// Route to serve the nike-catalog page
app.get('/nike-catalog', (req, res) => {
    res.sendFile(path.join(nike-catalog.html, 'views', 'nike-catalog.html'));
});

// Route to serve the nike-raffle page
app.get('/nike-raffle', (req, res) => {
    res.sendFile(path.join(nike-raffle.html, 'views', 'nike-raffle.html'));
});

// Route to start the Puppeteer bot
app.post('/start-bot', async (req, res) => {
    const { email, password, productUrl, cardDetails } = req.body;

    const browser = await puppeteer.launch({
        headless: false,       // Run browser in non-headless mode
        defaultViewport: null, // Use default viewport size of the browser window
        args: ['--start-maximized'] // Start the browser window maximized
    });
    const page = await browser.newPage();

    try {
        await page.goto('https://www.nike.com', { waitUntil: 'networkidle2' });

        // Example login process
        await page.click('a[href="/login"]');
        await page.waitForSelector('input[type="email"]');
        await page.type('input[type="email"]', email);
        await page.type('input[type="password"]', password);
        await page.click('button[type="submit"]');

        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // Example product page navigation and checkout process
        await page.goto(productUrl, { waitUntil: 'networkidle2' });
        await page.click('button[aria-label="Add to Cart"]');

        await page.goto('https://www.nike.com/cart', { waitUntil: 'networkidle2' });
        await page.type('input[name="cardNumber"]', cardDetails.number);
        await page.type('input[name="expiryDate"]', cardDetails.expiry);
        await page.type('input[name="cvv"]', cardDetails.cvv);

        await page.click('button[aria-label="Place Your Order"]');

        await browser.close();
        res.send('Checkout process completed.');
    } catch (error) {
        await browser.close();
        res.status(500).send('Checkout process failed.');
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
