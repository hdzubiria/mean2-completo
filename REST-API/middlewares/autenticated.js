'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_Secreta_curso';

function ensureAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'la petición no tiene la cabecera de autenticación' });
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {

        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'Token ha EXPIRADO' });
        }

    } catch (ex) {
        console.log(ex);
        return res.status(404).send({ message: 'Token NO Válido' });
    }
    req.user = payload;

    next();

};


module.exports = {
    ensureAuth
}