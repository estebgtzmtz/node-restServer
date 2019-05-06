const express = require('express');

const app = express();

//Hacemos uso de todas las rutas creadas en la carpeta routes
app.use(require('./user'));
app.use(require('./login'));

module.exports = app;