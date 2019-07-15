'use strict'

var express = require('express');
var multipart = require('connect-multiparty');

var UserController = require('../controllers/user');
var md_auth = require('../middlewares/autenticated');

var api = express.Router();
var md_upload = multipart({ uploadDir: './uploads/users' });


api.post('/login', UserController.loginUser);
api.post('/register', UserController.saveUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);


module.exports = api;