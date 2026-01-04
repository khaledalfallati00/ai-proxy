const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ADMIN_KEY = "KA12345KA";
let channels = [{ id: 1, name: "TechHub", desc: "أهلاً بك في قناة التقنية", link: "#" }];
let pendingRequests = [];

// مسار جلب القنوات المعتمدة
app.get('/channels', (req, res) => res.json(channels));

// مسار جلب طلبات المراجعة (للأدمن فقط)
app.get('/pending', (req, res) => {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).json({message: "Unauthorized"});
    res.json(pendingRequests);
});

// مسار إرسال طلب قناة جديدة من مستخدم
app.post('/request-channel', (req, res) => {
    pendingRequests.push({ id: Date.now(), ...req.body });
    res.json({ message: "Success" });
});

// مسار الموافقة على القناة
app.post('/approve-channel/:id', (req, res) => {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).json({message: "Unauthorized"});
    const id = parseInt(req.params.id);
    const index = pendingRequests.findIndex(p => p.id === id);
    if (index > -1) {
        channels.push(pendingRequests[index]);
        pendingRequests.splice(index, 1);
        res.json({ message: "Approved" });
    }
});

app.listen(PORT, () => console.log("Server Running"));
