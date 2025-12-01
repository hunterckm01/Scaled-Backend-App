const captainModel = require("../models/captain.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklisttoken.model')
const {
  subscribeToQueue,
  publishToQueue,
} = require("../service/rabbit.service.js");

const pendingRequests = [];

module.exports.register = async(req, res) => {
    try{
      const { name, email, password } = req.body;
      const captain = await captainModel.findOne({ email });

      if (captain) {
        return res.status(400).json({
          message: "captain already Exists",
        });
      }
      const hash = await bcrypt.hash(password, 10);
      const newCaptain = new captainModel({ name, email, password: hash });

      await newCaptain.save();
      // It's necessary that you don't share the password
      delete newCaptain._doc.password;

      const token = jwt.sign({ id: newCaptain._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token);

      res.send({ token, newCaptain });
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports.login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const captain = await captainModel.findOne({ email }).select("+password");

        if(!captain){
            return res.status(400).json({
                message: "Invalid Email Or Password"
            })
        }

        const isMatch = await bcrypt.compare(password, captain.password);

        if(!isMatch){
            return res.status(400).json({
                message: "Password Doesn't matched"
            })
        }

        const token = jwt.sign({id: captain._id}, process.env.JWT_SECRET, {expiresIn: 3600});
        
        // It's necessary to not share the password 
        delete captain._doc.password;
        res.cookie('token', token);

        res.send({token, captain});

    }
    catch(err){
        res.status(500).json({message: err.message
        })
    }
}

module.exports.logout = async(req, res) => {
    try{
        const token = req.cookies.token;
        await blacklistTokenModel.create({token});
        res.clearCookie('token');
        res.send({message: "Captain logged out successfully"});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

module.exports.profile = async(req, res) => {
    try{
        console.log(req.captain);
        res.send(req.captain);
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.toggleAvailablity = async (req, res) => {
  try {
    const captain = await captainModel.findById(req.captain._id);
    console.log(captain);
    captain.rideAvailable = !captain.rideAvailable;
    await captain.save();
    res.send(captain);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.waitForNewRide = async(req, res) => {
  try{
    console.log("Waiting for new ride");
    req.setTimeout(30000, ()=>{
      res.status(204).end();
    })

    console.log("After 30 seconds");
    pendingRequests.push(res);
  }
  catch(err){
    res.status(500).json({
      error: err.messaage
    })
  }
}

  subscribeToQueue("new-ride", (data) => {
    const rideData = JSON.parse(data);
    
    pendingRequests.forEach(res => {
      console.log(res);
      res.json({data: rideData});
    });
    
    pendingRequests.length = 0;
  })

// module.exports.initRideConsumer = () => {
//   console.log(new Date().toISOString())
  // subscribeToQueue("new-ride", (data) => {
  //   const rideData = JSON.parse(data);
    
  //   pendingRequests.forEach(res => {
  //     console.log(res);
  //     res.json({data: rideData});
  //   });
    
  //   pendingRequests.length = 0;
  // })
// }