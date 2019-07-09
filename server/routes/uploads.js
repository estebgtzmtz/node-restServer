const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

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

    let newFileName = `${id}-${new Date().getMilliseconds()}.${fileToUpload.name}`;

    fileToUpload.mv(`uploads/${destinationFolder}/${newFileName}`, (err) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (destinationFolder === 'users') {
            userImage(id, res, newFileName);
        } else {
            productImg(id, res, newFileName);
        }
    })
});

const productImg = (id, res, newFileName) => {
    Product.findById(id, (err, DBProductSuccesfullyFound) => {
        if (err) {
            dropImage(newFileName, 'products');
            res.status(500).json({ ok: false, err });
        }

        if (!DBProductSuccesfullyFound) {
            dropIdropImage(newFileName, 'products');
            mage
            res.status(400).json({ ok: false, err: { message: 'Product do not exist' } });
        }

        dropImage(DBProductSuccesfullyFound.img, 'products');

        DBProductSuccesfullyFound.img = newFileName;

        DBProductSuccesfullyFound.save((err, dbProduct) => {
            res.json({ ok: true, dbProduct, newFileName })
        })

    })
}

const userImage = (id, res, newFileName) => {
    User.findById(id, (err, DBUSerSuccesfullyFound) => {
        if (err) {
            dropImage(newFileName, 'users');
            res.status(500).json({ ok: false, err });
        }

        if (!DBUSerSuccesfullyFound) {
            dropImage(newFileName, 'users');
            res.status(400).json({ ok: false, err: { message: 'User do not exist' } });
        }

        dropImage(DBUSerSuccesfullyFound.img, 'users');

        DBUSerSuccesfullyFound.img = newFileName;

        DBUSerSuccesfullyFound.save((err, dbUser) => {
            res.json({ ok: true, dbUser, newFileName })
        })
    })
}

const dropImage = (imgName, folderName) => {
    let imgPath = path.resolve(__dirname, `../../uploads/${folderName}/${imgName}`);
    if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
    }
}

module.exports = app;