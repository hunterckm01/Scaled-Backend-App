const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes.js');
const cookieParser = require('cookie-parser');

const connectDB = require('./db/db.js');
connectDB();

const rabbitMq = require('./service/rabbit.service.js')
console.log("Request from App");
rabbitMq.initRabbitMQ();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/', userRoutes);

module.exports = app;