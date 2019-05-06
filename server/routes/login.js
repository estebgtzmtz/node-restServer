const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const app = express();

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, DBUserFoundSuccessfully) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!DBUserFoundSuccessfully) {
            return res.status(400).json(({ ok: false, err: { message: "Incorrect Username or password" } }));
        }

        if (!bcrypt.compareSync(body.password, DBUserFoundSuccessfully.password)) {
            return res.status(400).json({ ok: false, err: ({ message: "Incorrect username or Password" }) })
        }

        let token = jwt.sign({ DBUserFoundSuccessfully },
            process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({ ok: true, DBUserFoundSuccessfully, token });

    })
});

module.exports = app;