const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { tokenVerify, verificaAdmin_Role } = require('../middleware/authentication');

const app = express();

app.get('/usuario', tokenVerify, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    let to = req.query.to || 5;
    to = Number(to);

    User.find({ state: true }, 'name email state google').skip(from).limit(to)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({ ok: false, err });
            }

            User.count({ state: true }, (err, counter) => {
                res.json({ ok: true, users, counter });
            })
        });
});


app.post('/usuario', [tokenVerify, verificaAdmin_Role], (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, DBUser) => {
        if (err) {
            return res.status(400).json({ ok: false, err })
        }

        res.json({ ok: true, user: DBUser });
    });
});



app.put('/usuario/:id', [tokenVerify, /*verificaAdmin_Role*/ ], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, DBUser) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, user: DBUser });
    });
});



app.delete('/usuario/:id', [tokenVerify, /*verificaAdmin_Role*/ ], (req, res) => {
    let id = req.params.id;

    let stateChanged = { state: false };

    User.findByIdAndUpdate(id, stateChanged, { new: true }, (err, logicDeletedUser) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }

        if (!logicDeletedUser) {
            return res.status(400).json({ ok: false, err: { message: 'User not found' } });
        }

        res.json({ ok: true, logicDeletedUser });
    });
});

/*
//Borrado "fisico de la BD"
app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

    User.findByIdAndRemove(id, (err, deletedUserSuccessfully) => {
        if(err){https://www.facebook.com/1642446905771353/posts/2784995421516490/
            return res.status(400).json({ok:false, err});
        }

        if(!deletedUserSuccessfully){
            return res.status(400).json({ok: false, err:{message:'User not found'}});
        }

        res.json({ok: true, deletedUserSuccessfully});
    });
});
*/
module.exports = app;