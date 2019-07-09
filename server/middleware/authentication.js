const jwt = require('jsonwebtoken');
/*
    VERIFICAR TOKEN
*/
let tokenVerify = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ ok: false, err })
        }

        req.user = decoded.user;
        next();
    })
};

/*
    VERIFICA ADMIN_ROLE
*/
let adminRoleVerify = (req, res, next) => {
    let usuario = jwt.decode(req.get('token'));

    if (usuario.DBUserFoundSuccessfully.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({ ok: false, err: { message: 'User is not an administrator' } });
    }
};

/*
    VERIFICA TOKEN DE IMAGEN
*/
let imgTokenVerify = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ ok: false, err })
        }

        req.user = decoded.user;
        next();
    })
}
module.exports = {
    tokenVerify,
    adminRoleVerify,
    imgTokenVerify
}