const express = require('express');
const jwt = require('jsonwebtoken');
let { tokenVerify } = require('../middleware/authentication');
let app = express();
let Product = require('../models/product');

app.post('/product', tokenVerify, (req, res) => {
    let getInfoUser = jwt.decode(req.get('token'));
    let getUserId = getInfoUser.DBUserFoundSuccessfully._id;

    let body = req.body,
        getName = body.name,
        getUnitPrice = body.unitPrice,
        getDescription = body.description,
        getCategory = body.category;

    let product = new Product({
        name: getName,
        unitPrice: getUnitPrice,
        description: getDescription,
        category: getCategory,
        user: getUserId
    });

    product.save((err, DBProduct) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!DBProduct) {
            return res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, DBProduct });
    });
});

app.put('/product/:id', tokenVerify, (req, res) => {
    let getInfoUser = jwt.decode(req.get('token'));
    let getUserId = getInfoUser.DBUserFoundSuccessfully._id;

    let id = req.params.id;
    let body = req.body;

    let productUpdate = { description: body.description, user: getUserId }

    Product.findByIdAndUpdate(id, productUpdate, { new: true, runValidators: true }, (err, DBCategory) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!DBCategory) {
            return res.status(400).json({ ok: false, err })
        }

        res.json({ ok: true, DBCategory });
    });
});

module.exports = app;