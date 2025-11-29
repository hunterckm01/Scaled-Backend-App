const express = require('express')
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware')
const rideController = require('../controllers/ride.controller')

router.post('/create-ride', authMiddleware.userAuth, rideController.createRide);


module.exports = router;