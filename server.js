const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// السماح لملف الـ HTML بالاتصال بالخادم
app.use(cors());
app.use(express.json());

// كلمة المرور للدخول كمسؤول (تطابق الموجودة في الـ HTML)
const ADMIN_KEY = "KA12345KA";

// مصفوفات لتخزين القنوات في الذاكرة
let channels = [
    { id: 1, name: "TechHub News", desc: "القناة الرسمية لأخبار المنصة والتقنية", link: "https://t.me/techhub" }
];
let pendingRequests = [];

// --- المسارات البرمجية (API Endpoints) ---

// جلب القنوات العامة للعرض
app.get('/channels', (req, res) => res.json(channels));

// استقبال طلب إضافة من مستخدم
app.post('/request-channel', (req, res) => {
    const newRequest = { id: Date.now(), ...req.body };
    pendingRequests.push(newRequest);
    res.json({ message: "Success" });
});

// جلب طلبات المراجعة (للأدمن فقط)
app.get('/pending', (req, res) => {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).send("Unauthorized");
    res.json(pendingRequests);
});

// الموافقة على قناة ونشرها
app.post('/approve-channel/:id', (req, res) => {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).send("Unauthorized");
    const id = parseInt(req.params.id);
    const index = pendingRequests.findIndex(p => p.id === id);
    if (index > -1) {
        channels.push(pendingRequests[index]);
        pendingRequests.splice(index, 1);
        res.json({ message: "Approved" });
    }
});

// رفض طلب أو حذف قناة موجودة
app.delete('/reject-channel/:id', (req, res) => {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).send("Unauthorized");
    pendingRequests = pendingRequests.filter(p => p.id !== parseInt(req.params.id));
    res.json({ message: "Rejected" });
});

app.delete('/delete-channel/:id', (req, res) => {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).send("Unauthorized");
    channels = channels.filter(c => c.id !== parseInt(req.params.id));
    res.json({ message: "Deleted" });
});

// إضافة مباشرة من الأدمن
app.post('/add-channel', (req, res) => {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).send("Unauthorized");
    channels.push({ id: Date.now(), ...req.body });
    res.json({ message: "Added" });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
