'use strict'

const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.port || 3977;
const dbPath = "mongodb://localhost:27017/curso_mean2";

mongoose.Promise = global.Promise;
mongoose.connect(dbPath, { useNewUrlParser: true, useFindAndModify: false }, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('La conexión a la base de Datos esta funcionando Correctamente');

        app.listen(port, () => {
            console.log(`Servidor REST escuchando en http://localhost:${port} `);
        });
    }
})