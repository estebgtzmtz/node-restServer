const express = require('express');
const fs = require('fs');
const path = require('path');
const { imgTokenVerify } = require('../middleware/authentication');

const app = express();

app.get('/image/:folder/:img', imgTokenVerify, (req, res) => {
    let folder = req.params.folder;
    let image = req.params.img;

    let imgPath = path.resolve(__dirname, `../../uploads/${folder}/${image}`);

    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/nel.jpg');
        res.sendFile(noImagePath);
    }
})

module.exports = app;