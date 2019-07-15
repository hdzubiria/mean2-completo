'use strict'

const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');

const Album = require('../models/album');
const Song = require('../models/song');

function getAlbums(req, res) {
    var artistId = req.params.artist;

    if (!artistId) {
        // Extrae todos los Albumes de la base de datos
        var find = Album.find().sort('title');
    } else {
        var find = Album.find({ artist: artistId }).sort('year');
    }

    find.populate({ path: 'artist' }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: En la petción de albumes' });
        } else {
            if (!albums) {
                res.status(404).send({ message: 'ERROR: No hay álbumes' });
            } else {
                res.status(200).send({ albums });
            }
        }
    })

}

function getAlbum(req, res) {
    var albumId = req.params.id;

    Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: error en la petición de albumes' });
        } else {
            if (!album) {
                res.status(404).send({ message: 'ERROR: El álbum no Existe' });
            } else {
                res.status(200).send({ album });
            }
        }
    })
}

function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, newAlbum) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: Creando nuevo Album' });
        } else {
            if (!newAlbum) {
                res.status(404).send({ message: 'ERROR: El álbum no ha sido Guardado' });
            } else {
                res.status(200).send(newAlbum);
            }
        }
    })
}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, updatedAlbum) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: Guardando el álbum' });
        } else {
            if (!updatedAlbum) {
                res.status(404).send({ message: 'ERROR: El álbum no ha sido Actualizado' });
            } else {
                res.status(200).send({ album: updatedAlbum });
            }
        }
    })
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

    Album.findByIdAndDelete(albumId, (err, deleteAlbum) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: Borrando el álbum' });
        } else {
            if (!deleteAlbum) {
                res.status(404).send({ message: 'ERROR: El álbum no ha sido Encontrado' });
            } else {
                //Borrar Canciones
                Song.find({ album: albumId }).remove((err, songDeleted) => {
                    if (err) {
                        res.status(500).send({ message: 'ERROR: Borrando la Canción' });
                    } else {
                        if (!songDeleted) {
                            res.status(404).send({ message: 'ERROR: Canción no ha sido Eliminada' });
                        } else {
                            res.status(200).send({ album: deleteAlbum });
                        }
                    }

                })
            }
        }
    })
}

function uploadImage(req, res) {
    var albumId = req.params.id;

    var file_name = 'Imagen no configurada..';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[file_split.length - 1];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[ext_split.length - 1];

        if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'gif') {
            Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'ERROR: No se pudo actualizar la Imagen del álbum' });
                } else {
                    if (!albumUpdated) {
                        res.status(404).send({ message: 'ERROR: No se pudo actualizar el álbum' });
                    } else {
                        res.status(200).send({ album: albumUpdated });
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
    var path_file = './uploads/albums/' + imageFile;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file))

        } else {
            res.status(200).send({ message: 'No existe la Imagen' });
        }
    });

}


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}