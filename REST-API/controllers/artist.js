'use strict'

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const mongoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');


function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: error en la petición de artitas' });
        } else {
            if (!artist) {
                res.status(404).send({ message: 'ERROR: El artista no Existe' });
            } else {
                res.status(200).send(artist);
            }
        }
    })
}

function saveArtist(req, res) {
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, newArtist) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: Creando nuevo artista' });
        } else {
            if (!newArtist) {
                res.status(404).send({ message: 'ERROR: El artista no ha sido Guardado' });
            } else {
                res.status(200).send(newArtist);
            }
        }
    })
}


function getArtists(req, res) {
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }
    var itemsPerPage = 4;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: En la petción de artistas' });
        } else {
            if (!artists) {
                res.status(404).send({ message: 'ERROR: No hay Artistas' });
            } else {
                res.status(200).send({
                    registros: total,
                    page: parseInt(page, 10),
                    pages: total / itemsPerPage,
                    artists: artists
                });
            }
        }
    })
}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, updatedArtist) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: Guardando el  artista' });
        } else {
            if (!updateArtist) {
                res.status(404).send({ message: 'ERROR: El artista no ha sido Actualizado' });
            } else {
                res.status(200).send(updatedArtist);
            }
        }
    })
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndDelete(artistId, (err, deleteArtist) => {
        if (err) {
            res.status(500).send({ message: 'ERROR: Borrando el  artista' });
        } else {
            if (!deleteArtist) {
                res.status(404).send({ message: 'ERROR: El artista no ha sido Encontrado' });
            } else {
                //Borrar albuns
                Album.find({ artist: artistId }).remove((err, deletedAlbum) => {
                    if (err) {
                        res.status(500).send({ message: 'ERROR: Borrando el  Album' });
                    } else {
                        if (!deletedAlbum) {
                            res.status(404).send({ message: 'ERROR: Album no ha sido Eliminado' });
                        } else {
                            // Borrar Canciones
                            Song.find({ album: deletedAlbum._id }).remove((err, songDeleted) => {
                                if (err) {
                                    res.status(500).send({ message: 'ERROR: Borrando el  Canción' });
                                } else {
                                    if (!songDeleted) {
                                        res.status(404).send({ message: 'ERROR: Cancion no ha sido Eliminada' });
                                    } else {
                                        res.status(200).send(deleteArtist);
                                    }
                                }

                            })
                        }
                    }
                })
            }
        }
    })
}


function uploadImage(req, res) {
    var artistId = req.params.id;

    var file_name = 'Imagen no configurda..';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[file_split.length - 1];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[ext_split.length - 1];

        if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'gif') {
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'ERROR: No se pudo actualizar la Imagen del artista' });
                } else {
                    if (!artistUpdated) {
                        res.status(404).send({ message: 'ERROR: No se pudo actualizar el artista' });
                    } else {
                        res.status(200).send({ artist: artistUpdated });
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
    var path_file = './uploads/artists/' + imageFile;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file))

        } else {
            res.status(200).send({ message: 'No existe la Imagen' });
        }
    });

}



module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}