const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());
let items = [];

app.get('/items', (req, res) => {
    res.json(items);
});

app.post('/items', (req, res) => {
    const item = req.body;
    items.push(item);
    res.status(201).json(item);
});

app.get('/items/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < items.length) {
        res.json(items[index]); 
    } else {
        res.status(404).send('Ni ma');
    }
});


app.put('/items/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < items.length) {
        items[index] = req.body;
        res.json(items[index]);
    } else {
        res.status(404).send('Ni ma');
    }
});

app.delete('/items/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < items.length) {
        const deletedItem = items.splice(index, 1);
        res.json(deletedItem);
    } else {
        res.status(404).send('Ni ma');
    }
});

app.listen(port, () => {
    console.log(`Server: http://localhost:${port}`);
});