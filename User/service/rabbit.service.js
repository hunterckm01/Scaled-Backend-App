const amqp = require('amqplib')

let connection, channel;

async function connect(){
    try{
        // console.log(process.env.RABBIT_URL);
        connection = await amqp.connect(process.env.RABBIT_URL);
        channel = await connection.createChannel();
        console.log("Connected to rabbit mq");
    }
    catch(err){
        console.log("Not connected to rabbit mq")
        console.log(err);
    }
}

async function initRabbitMQ(){
    if(!connect)
        await connect();
}

async function subscribeToQueue(queueName, callback){
    try{
        // console.log("Request from 1");
        if(!channel)
            await connect();
        await channel.assertQueue(queueName);
        channel.consume(queueName, (message)=>{
            callback(message.content.toString());
            channel.ack(message);
        })
    }
    catch(err){
        console.log(err.message);
    }
}

async function publishToQueue(queueName, data){
    try{

        if(!channel)
            await connect();
        await channel.assertQueue(queueName);
        channel.sendToQueue(queueName, Buffer.from(data))
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports = {
    subscribeToQueue, publishToQueue, connect, initRabbitMQ
}