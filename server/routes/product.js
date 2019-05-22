const express = require('express');
let { tokenVerify } = require('../middleware/authentication');

let app = express();

let Product = require('../models/product');


module.exports = app;