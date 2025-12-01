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

module.exports.acceptRide = async(req, res, next) => {
    try{
        const {rideId} = req.query
        console.log("Reached here");
        const ride = await rideModel.findById(rideId);
        
        if(!ride){
            return res.status(404).json({
                message: "Ride Not Found"
            })
        }
    
        ride.status = 'accepted';
        await ride.save();
        
        publishToQueue('ride-accepted', JSON.stringify(ride));
        
        res.send(ride);
    }
    catch(err){
        console.log("Error Recieved");
        return res.status(500).json({
            error: err.message
        })
    }
}