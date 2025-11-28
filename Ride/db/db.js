const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log('Ride Service Backend Connected')
    })
    .catch(err=>{
        console.log(err);
    })
}

module.exports = connectDB;