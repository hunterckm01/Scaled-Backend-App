const axios = require('axios');
const jwt = require('jsonwebtoken');

module.exports.userAuth = async(req, res, next) => {
    try{
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        // console.log(token);
        if(!token){
            return res.status(401).json({
                message: "Unauthorized"
        })}
        
        // console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // console.log("Reached after decoded");

        const response = await axios.get(`${process.env.BASE_URL}/user/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // console.log("Response will be generated");
        const user = response.data;
        if(!user){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        req.user = user;
        // console.log("Next function is called")
        next();
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports.captainAuth = async(req, res, next) => {
    try{
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const response = await axios.get(`${BASE_URL}/captain/profile`, {
            headers: {Authorization: `Bearer ${token}`}
        })

        const captain = response.data;

        if(!captain)
            return res.status(401).json({
        message: "Unauthorized Access"})

        req.captain = captain;  
        next();
    }
    catch(err){
        res.status(200).json({
            message: err.message
        })
    }
}