const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = "AIzaSyC3rmVW31SI8-BAcOVfhgsEivaEQssgQKs";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(express.json());

// إضافة صفحة ترحيب للتأكد من عمل الرابط
app.get('/', (req, res) => res.send('السيرفر يعمل بنجاح! جاهز لاستقبال الطلبات.'));

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

        // فحص الرد للتأكد من وجود نص
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            res.json({ result: aiResponse });
        } else {
            // إرسال رسالة الخطأ القادمة من جوجل للمساعدة في الحل
            console.error("Gemini Error:", data);
            res.status(500).json({ error: "فشل Gemini في الرد. قد يكون المفتاح انتهى." });
        }
    } catch (error) {
        res.status(500).json({ error: "خطأ في الاتصال بالسيرفر" });
    }
});

app.listen(PORT, () => console.log("Server is running!"));
