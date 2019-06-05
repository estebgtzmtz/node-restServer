const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

//default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/uploads', (req, res) => {
    if (!req.files) {
        return res.status(400).json({ ok: false, message: 'No files were uploaded' });
    }

    let fileToUpload = req.files.file;
    console.log(fileToUpload)
    const validExtensions = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];

    if (!validExtensions.includes(fileToUpload.mimetype)) {
        return res.status(500).json({ ok: false, err: { message: `Only ${validExtensions.join(', ')} are accepted` } });
    }

    fileToUpload.mv(`uploads/${fileToUpload.name}`, (err) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        res.json({ ok: true, message: 'File Upload Successfully' });
    })
});

module.exports = app;