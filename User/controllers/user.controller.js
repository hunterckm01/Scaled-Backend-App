const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklisttoken.model')

module.exports.register = async(req, res) => {
    try{
      const { name, email, password } = req.body;
      const user = await userModel.findOne({ email });

      if (user) {
        return res.status(400).json({
          message: "User already Exists",
        });
      }
      const hash = await bcrypt.hash(password, 10);
      const newUser = new userModel({ name, email, password: hash });

      await newUser.save();
      // It's necessary that you don't share the password
      delete newUser._doc.password;

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token);

      res.send({ token, newUser });
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
        const user = await userModel.findOne({email}).select("+password");

        if(!user){
            return res.status(400).json({
                message: "Invalid Email Or Password"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({
                message: "Password Doesn't matched"
            })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: 3600});
        
        // It's necessary to not share the password 
        delete user._doc.password;
        res.cookie('token', token);

        res.send({token, user});

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
        res.send({message: "User logged out successfully"});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

module.exports.profile = async(req, res) => {
    try{
        console.log("Profile route hit");
        res.send(req.user);
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}