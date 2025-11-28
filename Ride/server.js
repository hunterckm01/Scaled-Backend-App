const http = require('http');
const app = require('./app');

const server = http.createServer(app);

server.listen('6001', ()=>{
    console.log('Ride server started at 6001');
})