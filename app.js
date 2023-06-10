const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'twig');

const modsFile = path.join(__dirname, 'mods.json');
// Check if mods.json file exists, if not, create an empty file
if (!fs.existsSync(modsFile)) {
    fs.writeFileSync(modsFile, '{}');
}

app.get('/', (req, res) => {
    const mods = JSON.parse(fs.readFileSync(modsFile));
    res.render('index', { mods });
});

app.post('/update', async (req, res) => {
    const modIdentifier = req.body.modIdentifier;
    const response = await axios.get(`https://api.modrinth.com/v2/project/${modIdentifier}`);
    data = response.data;
    delete data.body;
    const mods = JSON.parse(fs.readFileSync(modsFile));
    mods[modIdentifier] = data;
    fs.writeFileSync(modsFile, JSON.stringify(mods));

    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

