const express = require('express');
const router = express.Router()
const {handleSignup,verifySignupOtp} = require('../controllers/userController')

router.post('/signup',handleSignup)
router.post('/verifysignupotp',verifySignupOtp)
module.exports = router