/* 
    CONFIGURACION DEL PUERTO    
*/
process.env.PORT = process.env.PORT || 3000;

/*
    ENTORNO DE DESARROLLO
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*
    VENCIMIENTO DEL TOKEN
    60segundos - 60minutos - 24horas - 30dias
*/
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/*
    SEED de autentificacion
*/
process.env.SEED = process.env.SEED || 'este_es_el_SEED_desarrollo';

/*
    BASE DE DATOS
*/
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

/*
    GOOGLE CLIENT ID
*/
process.env.CLIENT_ID = process.env.CLIENT_ID || '458089339748-s9bjs3tnn7qnba26n4s6t8eu5jh2alot.apps.googleusercontent.com';