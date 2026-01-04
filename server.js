const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ADMIN_KEY = "KA12345KA"; // كلمة المرور

// مصفوفات التخزين
let channels = [
    { id: 1, name: "قناة التقنية", desc: "أهلاً بك في TechHub", link: "#" }
];
let pendingRequests = [];

// --- المسارات المطلوبة لعمل كود الـ HTML ---

// 1. جلب القنوات
app.get('/channels', (req, res) => res.json(channels));

// 2. استقبال طلبات المستخدمين (هذا ما كان ينقصك)
app.post('/request-channel', (req, res) => {
    const { name, desc, link } = req.body;
    if (!name || !link) return res.status(400).json({ message: "البيانات ناقصة" });
    const newRequest = { id: Date.now(), name, desc, link };
    pendingRequests.push(newRequest);
    res.json({ message: "تم الاستلام" });
});

// 3. جلب طلبات المراجعة للأدمن
app.get('/pending', (req, res) => {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).send("غير مصرح");
    res.json(pendingRequests);
});

// 4. الموافقة على قناة
app.post('/approve-channel/:id', (req, res) => {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).send("غير مصرح");
    const id = parseInt(req.params.id);
    const index = pendingRequests.findIndex(p => p.id === id);
    if (index > -1) {
        channels.push(pendingRequests[index]);
        pendingRequests.splice(index, 1);
        res.json({ message: "Approved" });
    }
});

// 5. الحذف والرفض
app.delete('/reject-channel/:id', (req, res) => {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).send("غير مصرح");
    pendingRequests = pendingRequests.filter(p => p.id !== parseInt(req.params.id));
    res.json({ message: "Rejected" });
});

app.delete('/delete-channel/:id', (req, res) => {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).send("غير مصرح");
    channels = channels.filter(c => c.id !== parseInt(req.params.id));
    res.json({ message: "Deleted" });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
