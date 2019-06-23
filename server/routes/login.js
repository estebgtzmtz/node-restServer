const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

//Google configs
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => { return res.status(403).json({ ok: false, err: e }) })

    User.findOne({ email: googleUser.email }, (err, DBUserFoundSuccessfully) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (DBUserFoundSuccessfully) {
            if (DBUserFoundSuccessfully.google === 'false') {
                return res.status(400).json({ ok: false, err: { message: 'User already exist' } });
            } else {
                let token = jwt.sign({ DBUserFoundSuccessfully },
                    process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({ ok: true, DBUserFoundSuccessfully, token });
            }
        } else {
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((err, DBUser) => {
                if (err) {
                    return res.status(400).json({ ok: false, err });
                }
                let token = jwt.sign({ DBUser },
                    process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({ ok: true, DBUser, token });
            });
        }
    });
});

module.exports = app;
