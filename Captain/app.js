const express = require('express');
const app = express();
const dotenv = require('dotenv');
const captainRoutes = require('./routes/captain.routes.js');
const cookieParser = require('cookie-parser');
const connect = require('./db/db.js');

dotenv.config();
connect();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/', captainRoutes);

module.exports = app;