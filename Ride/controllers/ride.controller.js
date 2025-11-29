const rideModel = require('../models/ride.model')
 const {subscribeToQueue, publishToQueue} = require('../service/rabbit.service')
module.exports.createRide = async(req, res, next) => {
    try{
        const {pickup, destination}  = req.body;
        const newRide = new rideModel({
            user: req.user._id,
            pickup,
            destination
        });

        publishToQueue("new-ride", JSON.stringify(newRide));
 
        await newRide.save();
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}