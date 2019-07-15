'use strict'

const tableName = "Artist";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var artistSchema = Schema({
    name: String,
    description: String,
    image: String
});

module.exports = mongoose.model(tableName, artistSchema);