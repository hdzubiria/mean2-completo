'use strict'

var express = require('express');
var multipart = require('connect-multiparty');


var SongController = require('../controllers/song');
var md_auth = require('../middlewares/autenticated');


var api = express.Router();
var md_upload = multipart({ uploadDir: './uploads/songs' });

api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFileSong);
api.get('/get-file-song/:imageFile', SongController.getSongFile);

module.exports = api;