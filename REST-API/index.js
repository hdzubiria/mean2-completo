'use strict'

const mongoose = require('mongoose');
const app = require('./app');

// CONEXION LOCAL
// const port = process.env.port || 3977;
// const dbPath = "mongodb://localhost:27017/curso_mean2";

// CONEXION A AZURE
//const port = process.env.port || 3977;
//const dbPath = "mongodb://cursomean2:0Pkdvi5FgQPEubi40tPdu51hKos9aATsZyoy1SMe1aAfy0FRSSn8PE09P2yT0HWZFtTiJsyWdwPqxhojeJZL0Q==@cursomean2.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false";

// CONEXION A MONGODB ATLAS
const port = process.env.port || 3977;
const dbPath = "mongodb+srv://musifyUser:57BNr89k294tfqJb@musify-cluster-vcv8g.mongodb.net/test?retryWrites=true&w=majority";



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