const http = require('http');
const app = require('./app');

const server = http.createServer(app);

server.listen(process.env.PORT, ()=>{
    console.log("User service is running on port 4001");
})

