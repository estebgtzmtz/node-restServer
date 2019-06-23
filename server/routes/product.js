const express = require('express');
const jwt = require('jsonwebtoken');
let { tokenVerify } = require('../middleware/authentication');
let app = express();
let Product = require('../models/product');

app.get('/product', tokenVerify, (req, res) => {
    Product.find({ available: true })
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, DBProductsSuccessfullyFound) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            Product.count({ available: true }, (err, counter) => {
                res.json({ ok: true, DBProductsSuccessfullyFound, counter })
            })

        })
});

app.get('/product/:id', tokenVerify, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, DBProductSuccessfullyFound) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            if (!DBProductSuccessfullyFound) {
                return res.status(400).json({ ok: false, err });
            }

            res.json({ ok: true, DBProductSuccessfullyFound });
        });
});

app.get('/product/search/:term', tokenVerify, (req, res) => {
    let term = req.params.term,
        regExp = new RegExp(term, 'i');
    Product.find({ name: regExp })
        .populate('category', 'description')
        .exec((err, DBProducts) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            res.json({ ok: true, DBProducts });
        });
});

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

        res.status(201).json({ ok: true, DBProduct });
    });
});

app.put('/product/:id', tokenVerify, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, DBProduct) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!DBProduct) {
            return res.status(400).json({ ok: false, err: { message: 'ID do not exist' } })
        }

        DBProduct.name = body.name;
        DBProduct.unitPrice = body.unitPrice;
        DBProduct.description = body.description;
        DBProduct.category = body.category;
        DBProduct.available = body.available;

        DBProduct.save((err, productSave) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            res.json({ ok: true, productSave })
        })
    });
});

app.delete('/product/:id', tokenVerify, (req, res) => {
    let id = req.params.id;

    let productAvailable = { available: false };

    Product.findByIdAndUpdate(id, productAvailable, { new: true, runValidators: true }, (err, logicDeletedProduct) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!logicDeletedProduct) {
            return res.status(400).json({ ok: false, err })
        }

        res.json({ ok: true, logicDeletedProduct });
    });
});

module.exports = app;
