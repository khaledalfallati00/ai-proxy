const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// هنا سيسحب السيرفر المفتاح من إعدادات Render السرية وليس من الكود
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('السيرفر يعمل بنظام الحماية!'));

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

        if (data.candidates && data.candidates[0].content) {
            res.json({ result: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: "تأكد من وضع المفتاح في Environment Variables داخل Render" });
        }
    } catch (error) {
        res.status(500).json({ error: "خطأ في الاتصال" });
    }
});

app.listen(PORT, () => console.log("Server is running!"));
