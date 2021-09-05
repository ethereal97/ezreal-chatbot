if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const {
    FACEBOOK_MESSENGING_TOKEN,
    APP_SECRET
} = process.env;
const PORT = process.env.PORT || 3000;
const { default: axios } = require('axios');
const e = require('express');
const messages = [];

const app = e();

app.use(e.json());

app.get('/webhook', (req, res) => {
    const token = req.query['hub.verify_token'];
    const challenege = req.query['hub.challenge'];
    if (token !== APP_SECRET) {
        return res.status(401).json({ error: 'unauthorized' });
    }
    res.send(challenege.toString());
});

app.post('/webhook', (req, res) => {
    let { object, entry } = req.body;
    if (object !== 'page') return res.status(400).json({ error: 'bad request' });
    res.status(200).send('OK');

    entry.forEach(({ sender, message }) => {
        let recipient = {
            id: sender.id
        };
        let is_greeted = messages.filter(m => {
            return m.sender.id === recipient.id;
        }).length;
        if (is_greeted) {
            return;
        }
        messages.push(e);
        axios.post(`https://graph.facebook.com/me/messages?access_token=${FACEBOOK_MESSENGING_TOKEN}`, {
                recipient,
                message: { text: 'မင်္ဂလာပါ' },
                messaging_type: "RESPONSE"
            })
            .catch(err => console.error(err, err.message));
        setTimeout(() => {
            axios.post(`https://graph.facebook.com/me/messages?access_token=${FACEBOOK_MESSENGING_TOKEN}`, {
                    recipient,
                    message: { text: 'Ezreal Creation မှ ကြိုဆိုပါတယ်။' },
                    messaging_type: "RESPONSE"
                })
                .catch(err => console.error(err, err.message));
        }, 800);
    });
});

app.get('/messages', (req, res) => {
    if (req.query.token !== APP_SECRET) return res.status(403).json({ error: 'Forbidden' });
    res.json({ data: messages, });
});

app.all('*', (req, res) => res.status(404).json({ error: 'Not Found' }));

app.listen(PORT, () => console.log(`server is running on port: ${PORT} or http://localhost:${PORT}`));