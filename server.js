const express = require('express');
const Scraper = require('images-scraper');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Create scraper instance with v7.0.0 options
const google = new Scraper({
  // User agent (optional)
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  
  // Puppeteer options
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ],
  },
  
  // Safe search (optional)
  safe: false,
});

// API endpoint for image search
app.post('/api/search', async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`🔍 Searching for: ${query} (${limit} images) using v7.0.0`);
    console.log('⏳ This may take a few seconds...');
    
    // Scrape images - v7.0.0 uses the same scrape method
    const results = await google.scrape(query, limit);
    
    console.log(`✅ Found ${results.length} images`);
    
    res.json({
      success: true,
      query,
      count: results.length,
      images: results
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Multiple queries endpoint (v7.0.0 feature)
app.post('/api/search-multiple', async (req, res) => {
  try {
    const { queries, limit = 5 } = req.body;
    
    if (!queries || !Array.isArray(queries)) {
      return res.status(400).json({ error: 'Queries array is required' });
    }

    console.log(`🔍 Searching multiple queries: ${queries.join(', ')}`);
    
    // v7.0.0 supports array of queries
    const results = await google.scrape(queries, limit);
    
    res.json({
      success: true,
      queries,
      results
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📸 Using images-scraper v7.0.0`);
});
