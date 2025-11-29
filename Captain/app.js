const express = require('express');
const app = express();
require('dotenv').config();
const captainRoutes = require('./routes/captain.routes.js');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db.js');
const rabbitMq = require('./service/rabbit.service')

// dotenv.config();

connectDB();
rabbitMq.connect();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/', captainRoutes);

module.exports = app;