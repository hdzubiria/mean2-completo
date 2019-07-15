'use strict'

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');

const User = require('../models/user');
const jwt = require('../services/jwt');


function saveUser(req, res) {
    var user = new User();

    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = null;

    if (params.password) {
        bcrypt.hash(params.password, null, null, function(err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null & user.email != null) {
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al Guardar el usuario' });
                    } else {
                        if (!userStored) {
                            res.status(404).send({ message: 'No se ha registrado el Usuario' });
                        } else {
                            res.status(200).send(userStored);
                        }
                    }
                });

            } else {
                res.status(200).send({ message: 'Introduce todos los Campos del Usuario' });
            }
        });

    } else {
        res.status(200).send({ message: 'Introduce la Contraseña' });
    }
}

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error en la Petición' })
        } else {
            if (!user) {
                res.status(404).send({ message: 'El Usuario no existe' })
            } else {
                bcrypt.compare(password, user.password, function(err, check) {
                    if (check) {
                        if (params.gethash) {
                            // armar un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });

                        } else {
                            res.status(200).send(user)
                        }
                    } else {
                        res.status(404).send({ message: 'El Usuario no se ha podido Autenticar' })
                    }
                })

            }
        }
    })
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso de Actulización' });
    }

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al Actualizar el Usuario' });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se pudo actualizar el usuario' });
            } else {
                res.status(200).send(userUpdated);
            }
        }
    })

}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'Imagen no configurda..';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[file_split.length - 1];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[ext_split.length - 1];

        if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'No se pudo actualizar la imagen del usuario' });

                } else {
                    if (!userUpdated) {
                        res.status(404).send({ message: 'No se pudo actualizar el usuario' });
                    } else {
                        res.status(200).send({ image: file_name, user: userUpdated });
                    }

                }
            });

        } else {
            res.status(200).send({ message: 'Tipo de Archivo Incorrecto se soportan (jpg, png y gif)' });
        }

    } else {
        res.status(200).send({ message: 'No se ha seleccionado ninguna imagen' });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file))

        } else {
            res.status(200).send({ message: 'No existe la Imagen' });
        }
    });

}

module.exports = {
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};