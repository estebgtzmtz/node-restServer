require('./config/config');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Habilitar la carpeta PUBLIC
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuracion global de rutas
app.use(require('./routes/index'));

//Conexion a la BD mongodb
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;

    console.log('Conexion exitosa a la BD')
});

//Puerto en el que se levanta el server
app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', 3000);
});