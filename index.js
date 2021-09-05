if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const PORT = process.env.PORT || 3000;
const e = require('express');
const messages = [];

const app = e();

app.use(e.json());

app.get('/webhook', (req, res) => {
    const APP_SECRET = process.env.APP_SECRET;
    const token = req.query['hub.verify_token'];
    const challenege = req.query['hub.challenge'];
    if (token !== APP_SECRET) {
        return res.status(401).json({ error: 'unauthorized' });
    }
    res.send(challenege.toString());
});

app.post('/webhook', (req, res) => {
    let body = req.body;
    messages.push(body);
    res.status(200).send('OK');
});

app.get('/messages', (req, res) => {
    if (req.query.token !== process.env.APP_SECRET) return res.status(403).json({ error: 'Forbidden' });
    res.json({ data: messages, });
});

app.all('*', (req, res) => res.status(404).json({ error: 'Not Found' }));

app.listen(PORT, () => console.log(`server is running on port: ${PORT} or http://localhost:${PORT}`));