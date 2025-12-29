const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// المفتاح الجديد الذي أرسلته الآن
const GEMINI_API_KEY = "AIzaSyDEXilH-rO39SgNIw3O-mPILl5jOMJcnZY";

// الرابط المحدث مع الإصدار v1beta
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('السيرفر يعمل بنجاح بالمفتاح الجديد!'));

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
            console.error("Gemini Error:", data);
            res.status(500).json({ error: "خطأ في استجابة جوجل، تأكد من صلاحية المفتاح الجديد." });
        }
    } catch (error) {
        res.status(500).json({ error: "خطأ في الاتصال بالسيرفر" });
    }
});

app.listen(PORT, () => console.log("Server is running with the new key!"));
