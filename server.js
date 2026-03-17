const express = require('express');
const Scraper = require('images-scraper');
const cors = require('cors');

const app = express();
app.use(cors()); // Allows your HTML page to talk to this server
app.use(express.json());

const google = new Scraper({
  puppeteer: {
    headless: true, // Set to false if you want to watch the browser work
    args: ['--no-sandbox'] 
  },
});

app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  try {
    console.log(`Searching for: ${query}`);
    // Scraping 15 images for speed
    const results = await google.scrape(query, 15);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to scrape images' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
