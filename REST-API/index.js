'use strict'

const mongoose = require('mongoose');
const app = require('./app');

// CONEXION LOCAL
const port = process.env.port || 3977;
const dbPath = "mongodb://localhost:27017/curso_mean2";

// CCONEXION A AZURE
// const port = process.env.port || 3977;
// const dbPath = "mongodb://cursomean2:qvmkZ3p2MqtBjRjsiM70kmcLQZMKlNuAi4vXfsVkq750Ze91Btn94PdyLjvRONe8sQHzMStfVSWs85g0y63nNA==@cursomean2.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false";


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