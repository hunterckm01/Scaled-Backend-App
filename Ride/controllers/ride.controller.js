const rideModel = require('../models/ride.model')
 const {subscribeToQueue, publishToQueue} = require('../service/rabbit.service')
module.exports.createRide = async(req, res, next) => {
    try{
        const {pickup, destination}  = req.body;
        // console.log(req.user._id);
        const newRide = new rideModel({
            user: req.user._id,
            pickup,
            destination
        });

        await newRide.save();
        // console.log("Reached here");
        publishToQueue("new-ride", JSON.stringify(newRide));
        res.send(newRide);
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}