'use strict'

var express = require('express');
var multipart = require('connect-multiparty');


var AlbumController = require('../controllers/album');
var md_auth = require('../middlewares/autenticated');


var api = express.Router();
var md_upload = multipart({ uploadDir: './uploads/albums' });


api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;