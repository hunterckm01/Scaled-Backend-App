const express = require('express');
const app = express();
const router = express.Router();
const dotenv = require('dotenv')
const connectDB = require('./db/db')
dotenv.config();

connectDB();
// const captainController = require('../')

module.exports = app;