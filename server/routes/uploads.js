const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');

//default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/uploads/:folder/:id', (req, res) => {
    const destinationFolder = req.params.folder;
    const id = req.params.id;

    if (!req.files) {
        return res.status(400).json({ ok: false, message: 'No files were uploaded' });
    }

    const validFolders = ['products', 'users'];
    if (!validFolders.includes(destinationFolder)) {
        return res.status(500).json({ ok: false, err: { message: `Only folder destination ${validFolders.join(' and ')} are accepted` } });
    }

    const validExtensions = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];
    let fileToUpload = req.files.file;
    if (!validExtensions.includes(fileToUpload.mimetype)) {
        return res.status(500).json({ ok: false, err: { message: `Only "${validExtensions.join(', ')}" are accepted` } });
    }

    fileToUpload.mv(`uploads/${destinationFolder}/${fileToUpload.name}`, (err) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        res.json({ ok: true, message: 'File Upload Successfully' });
    })
});

module.exports = app;