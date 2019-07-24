'use strict'

const fs = require('fs');
const path = require('path');

const Song = require('../models/song');

function getSongs(req, res) {
    var albumId = req.params.album;

    if (!albumId) {
        // Extrae todos los Albumes de la base de datos
        var find = Song.find().sort('nombre');
    } else {
        var find = Song.find({ album: albumId }).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: En la petción canciones' });
        } else {
            if (!songs) {
                res.status(404).send({ message: 'ERROR: No hay canciones' });
            } else {
                res.status(200).send(songs);
            }
        }
    })

}

function getSong(req, res) {
    var songId = req.params.id;

    Song.findById(songId).populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, song) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: error en la petición de canción' });
        } else {
            if (!song) {
                res.status(404).send({ message: 'ERROR: La Canción no Existe' });
            } else {
                res.status(200).send(song);
            }
        }
    })
}

function saveSong(req, res) {
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.nombre = params.nombre;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save((err, newSong) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: Creando nueva Canción' });
        } else {
            if (!newSong) {
                res.status(404).send({ message: 'ERROR: La canción no ha sido Guardada' });
            } else {
                res.status(200).send(song);
            }
        }
    })
}

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, updatedSong) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: Guardando la Canción' });
        } else {
            if (!updatedSong) {
                res.status(404).send({ message: 'ERROR: La canción no ha sido Actualizada' });
            } else {
                res.status(200).send(updatedSong);
            }
        }
    })
}

function deleteSong(req, res) {
    var albumId = req.params.id;

    Song.findByIdAndDelete(albumId, (err, deletedSong) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: Borrando la Canción' });
        } else {
            if (!deletedSong) {
                res.status(404).send({ message: 'ERROR: La Canción NO ha sido Encontrada' });
            } else {
                res.status(200).send(deletedSong);
            }
        }
    })
}

function uploadFileSong(req, res) {
    var songId = req.params.id;

    var file_name = 'Imagen no configurada..';

    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[file_split.length - 1];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[ext_split.length - 1];

        if (file_ext == 'mp3' || file_ext == 'ogg') {
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'ERROR: No se pudo actualizar la canción' });
                } else {
                    if (!songUpdated) {
                        res.status(404).send({ message: 'ERROR: No se pudo actualizar la Canción' });
                    } else {
                        res.status(200).send(songUpdated);
                    }
                }
            });
        } else {
            res.status(200).send({ message: 'Tipo de Archivo Incorrecto se soportan (mp3, mp4 y wav)' });
        }
    } else {
        res.status(200).send({ message: 'No se ha seleccionado ninguna archivo de audio' });
    }
}

function getSongFile(req, res) {
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/' + songFile;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file))

        } else {
            res.status(200).send({ message: 'No existe el archivo de audio' });
        }
    });

}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFileSong,
    getSongFile
}