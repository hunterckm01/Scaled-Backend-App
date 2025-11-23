const express = require('express')
const expressProxy = require('express-http-proxy')

const app = express();
app.use('/user', expressProxy('http://localhost:4001'));
app.use('/captain', expressProxy('http://localhost:5001'));

app.listen(3001, ()=>{
    console.log("Gateway is Running on 3001");
})