const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// مفتاح API الخاص بك (تأكد من عدم وجود مسافات قبل أو بعده)
const GEMINI_API_KEY = "AIzaSyC3rmVW31SI8-BAcOVfhgsEivaEQssgQKs";

// الرابط المحدث لنسخة مستقرة من الموديل
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('السيرفر يعمل!'));

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

        // فحص الرد وتوضيح الخطأ إذا وجد
        if (data.candidates && data.candidates[0].content) {
            res.json({ result: data.candidates[0].content.parts[0].text });
        } else {
            console.error("Gemini API Error:", JSON.stringify(data));
            res.status(500).json({ error: "خطأ من جوجل: " + (data.error ? data.error.message : "رد غير معروف") });
        }
    } catch (error) {
        res.status(500).json({ error: "خطأ في الاتصال بالسيرفر" });
    }
});

app.listen(PORT, () => console.log("Server is running!"));
