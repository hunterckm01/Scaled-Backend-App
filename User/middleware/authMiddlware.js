const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const blackListTokenModel = require('../models/blacklisttoken.model');

module.exports.userAuth = async(req, res, next) => {
    try{
        const token =  req.cookies.token || req.headers.authorization.split(' ')[1];

        console.log("Request got", token);
        if(!token)
            return res.status(401).json({
        message: "Unauthorized"})

        const isBlackListed = await blackListTokenModel.find({token});
            
        console.log("Is black listed", isBlackListed);
        if(isBlackListed.length){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Verified by jwt", decoded);
        const user = await userModel.findById(decoded.id);
        console.log("user is ", user);
        delete user._doc.password;
        console.log("Done till bere");
        if(!user)
            return res.status(401).json({
        message: "Unauthorized access"})

        req.user = user;
        console.log("Next function is called");
        next();
    }   
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}