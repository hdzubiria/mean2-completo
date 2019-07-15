'use strict'

const tableName = "Album";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var albumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: { type: Schema.ObjectId, ref: 'Artist' }
});

module.exports = mongoose.model(tableName, albumSchema);