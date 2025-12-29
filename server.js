const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// مفتاحك الجديد الذي أرسلته
const GEMINI_API_KEY = "AIzaSyC3rmVW31SI8-BAcOVfhgsEivaEQssgQKs";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(express.json());

// صفحة ترحيب للتأكد من عمل السيرفر عند فتحه بالمتصفح
app.get('/', (req, res) => res.send('السيرفر يعمل بنجاح! جاهز لاستقبال طلبات التطبيق.'));

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

        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            res.json({ result: aiResponse });
        } else {
            console.error("Gemini Error:", data);
            res.status(500).json({ error: "فشل Gemini في الرد. تأكد من إعدادات المفتاح." });
        }
    } catch (error) {
        res.status(500).json({ error: "خطأ في الاتصال بالسيرفر" });
    }
});

app.listen(PORT, () => console.log("Server is running!"));
