const amqp = require('amqplib')

let connection, channel;

// let RABBIT_URI = process.env.RABBIT_URL;
async function connect(){
    try{
        connection = await amqp.connect(process.env.RABBIT_URL);
        channel = await connection.createChannel();
        // console.log("Here");
        console.log("Connected to rabbit mq");
    }
    catch(err){
        console.log(err)
    }
}

async function subscribeToQueue(queueName, callback){
    try{
        if(!channel)
            await connect();
        await channel.assertQueue(queueName);
        channel.consume(queueName, (message) => {
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
    subscribeToQueue, publishToQueue, connect
}