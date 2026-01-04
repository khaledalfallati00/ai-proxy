const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ADMIN_KEY = "KA12345KA";
let channels = [{ id: 1, name: "TechHub", desc: "أهلاً بك في منصة الوعي التقني", link: "#" }];
let pendingRequests = [];

// 1. جلب القنوات المعتمدة
app.get('/channels', (req, res) => res.json(channels));

// 2. إرسال طلب قناة جديدة
app.post('/request-channel', (req, res) => {
    const newRequest = { id: Date.now(), ...req.body };
    pendingRequests.push(newRequest);
    res.json({ message: "Success" });
});

// 3. جلب الطلبات المعلقة (للمسؤول فقط)
app.get('/pending', (req, res) => {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).send("Unauthorized");
    res.json(pendingRequests);
});

// 4. الموافقة على قناة ونشرها
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
