const express = require('express');
const jwt = require('jsonwebtoken');
let { tokenVerify, adminRoleVerify } = require('../middleware/authentication');
const app = express();
let Category = require('../models/category');

app.post('/category', tokenVerify, (req, res) => {
    let getInfoUser = jwt.decode(req.get('token'));
    let getUserId = getInfoUser.DBUserFoundSuccessfully._id;

    let getBody = req.body;
    let getDescription = getBody.description;

    let category = new Category({
        description: getDescription,
        user: getUserId
    });

    category.save((err, DBCategory) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!DBCategory) {
            return res.status(400).json({ ok: false, err })
        }

        res.json({ ok: true, DBCategory });
    })
});

app.get('/category', tokenVerify, (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, DBCategoriesSuccessfullyFound) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            res.json({ ok: true, DBCategoriesSuccessfullyFound })
        })

});

app.get('/category/:id', tokenVerify, (req, res) => {
    let id = req.params.id;

    Category.findById(id, (err, DBCategoryFoundSuccessfully) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!DBCategoryFoundSuccessfully) {
            return res.status(400).json({ ok: false, err: ({ message: 'Category do not exist' }) })
        }

        res.json({ ok: true, DBCategoryFoundSuccessfully })
    });
});

app.put('/category/:id', tokenVerify, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let categoryUpdate = { description: body.description }
    Category.findByIdAndUpdate(id, categoryUpdate, { new: true, runValidators: true }, (err, DBCategory) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!DBCategory) {
            return res.status(400).json({ ok: false, err })
        }

        res.json({ ok: true, DBCategory });
    });
});

app.delete('/category/:id', [tokenVerify, adminRoleVerify], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndDelete(id, (err, DBCategory) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!DBCategory) {
            return res.status(400).json({ ok: false, err: { message: 'id do not exist' } })
        }

        res.json({ ok: true, message: 'Category deleted' })
    });
});

module.exports = app;