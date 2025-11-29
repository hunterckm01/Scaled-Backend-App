const jwt = import('jsonwebtoken')

module.exports.userAuth = async(req, res, next) => {
    try{
        const token = req.cookies || req.headers.authorization.split(' ')[1];
        if(!token)
            return res.status(401).json({
                message: "Unauthorized"
        })

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}