const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// مفتاح Gemini التجريبي
const GEMINI_API_KEY = "AIzaSyDEXilH-rO39SgNIw3O-mPILl5jOMJcnZY";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }]
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        res.json({ result: aiResponse });
    } catch (error) {
        res.status(500).json({ error: "خطأ في السيرفر" });
    }
});

app.listen(PORT, () => console.log("Server is running!"));
