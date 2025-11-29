const express = require('express');
const app = express();
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes.js');
const cookieParser = require('cookie-parser');
const connect = require('./db/db.js');
const rabbitMq = require('./service/rabbit.service.js')

dotenv.config();
rabbitMq.connect();
connect();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/', userRoutes);

module.exports = app;