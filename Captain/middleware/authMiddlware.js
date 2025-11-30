const jwt = require('jsonwebtoken');
const captainModel = require('../models/captain.model');
const blackListTokenModel = require('../models/blacklisttoken.model');

module.exports.captainAuth = async(req, res, next) => {
    try{
        const token =  req.cookies.token || req.headers.authorization.split(' ')[1];

        if(!token)
            return res.status(401).json({
        message: "Unauthorized"})

        const isBlackListed = await blackListTokenModel.find({token});
        
        if(isBlackListed.length){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const captain = await captainModel.findById(decoded.id);

        delete captain._doc.password;

        if(!captain)
            return res.status(401).json({
        message: "Unauthorized access"})

        req.captain = captain;
        next();
    }   
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}