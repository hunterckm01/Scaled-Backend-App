const http = require('http');
const app = require('./app');

const server = http.createServer(app);

server.listen(process.env.PORT, ()=>{
    console.log("captain service is running on port 5001");
})

