const amqp = require('amqplib')

let connection, channel;

async function connect(){
    try{
        connection = await amqp.connect(process.env.RABBIT_URL);
        channel = await connection.createChannel();
        console.log("Connected to rabbit mq");
    }
    catch(err){
        console.log("Not connected to rabbit mq")
    }
}

async function subscribeToQueue(queueName, callback){
    if(!channel)
        await connect();
    await channel.assertQueue(queueName);
    channel.consume(queueName, (message)=>{
        callback(message.content.toString());
        channel.ack(message);
    })
}

async function publishToQueue(queueName, data){
    if(!channel)
        await connect();
    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(data))
}

module.exports = {
    subscribeToQueue, publishToQueue, connect
}