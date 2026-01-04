const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ADMIN_KEY = "KA12345KA";
let channels = [{ id: 1, name: "TechHub", desc: "أهلاً بك", link: "#" }];
let pendingRequests = [];

app.get('/channels', (req, res) => res.json(channels));
app.post('/request-channel', (req, res) => {
    pendingRequests.push({ id: Date.now(), ...req.body });
    res.json({ message: "Success" });
});
app.get('/pending', (req, res) => {
    if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).send("Unauthorized");
    res.json(pendingRequests);
});
app.post('/approve-channel/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pendingRequests.findIndex(p => p.id === id);
    if (index > -1) {
        channels.push(pendingRequests[index]);
        pendingRequests.splice(index, 1);
        res.json({ message: "Approved" });
    }
});
app.listen(PORT, () => console.log("Server Running"));
