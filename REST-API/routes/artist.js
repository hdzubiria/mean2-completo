'use strict'

var express = require('express');
var multipart = require('connect-multiparty');


var ArtistController = require('../controllers/artist');
var md_auth = require('../middlewares/autenticated');


var api = express.Router();
var md_upload = multipart({ uploadDir: './uploads/artists' });


api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;