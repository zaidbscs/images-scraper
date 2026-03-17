const express = require('express');
const { GOOGLE_IMG_SCRAP } = require('google-img-scrap');
const cors = require('cors');

const app = express();
app.use(cors()); // Crucial for Codespaces!

app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Missing query" });

    try {
        console.log(`Searching Google for: ${query}`);
        const data = await GOOGLE_IMG_SCRAP({
            search: query,
            limit: 20, // Number of images
            safeSearch: true
        });
        res.json(data.result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Search failed" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Backend running!`);
    console.log(`👉 In the PORTS tab, make sure port ${PORT} visibility is PUBLIC.`);
});
