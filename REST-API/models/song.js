'use strict'

const tableName = "Song";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var songSchema = Schema({
    number: Number,
    nombre: String,
    duration: Number,
    file: String,
    album: { type: Schema.ObjectId, ref: 'Album' }
});

module.exports = mongoose.model(tableName, songSchema);