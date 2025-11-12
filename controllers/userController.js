const User = require('../models/usersModel')
const transporter = require('../services/NodeMailer');
const bcrypt = require('bcryptjs')
require('dotenv/config')
// Temporary storage
const storeOTP = {}
const tempUser = {}
// otp generation function
function generateOTP(userId) {
    const otp = Math.floor(Math.random() * 9000 + 1000)
    storeOTP[userId] = otp
    return otp
}
async function handleSignup(req, res) {
    try {
        const { name, email, password } = req.body
        // Hashing password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        let OTP = generateOTP(email)
        console.log(OTP)
        // storing name and hashed password
        tempUser[email] = {
            name,
            hashedPassword
        }
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP for Signup",
            text: `your OTP is ${OTP}.\nplease Do not share it with anyone`, // plain‑text body
        });
        console.log("Message sent:", info.messageId);

        res.status(200).json({ massage: `otp sent successfully on ${email}`, email: email })
    }
    catch (err) {
        console.log(err)
    }
}
async function verifySignupOtp(req, res) {
    try {
        const { email, otp } = req.body
        console.log(storeOTP[email])
        if (!otp) {
            res.status().json({ massage: "otp not entered" })
        }
        if (otp !== storeOTP[email]) {
            res.status().json({ massage: `invalid otp` })
        }
        // save user to database
        await User.create({
            email: email,
            name: tempUser[email].name,
            password: tempUser[email].hashedPassword
        })
        // empty temporary storage after it is used
        delete storeOTP[email]
        delete tempUser[email]
        res.end('otp is valid')
    } catch (err) {
        console.log(err);
    }
}

module.exports = { handleSignup, verifySignupOtp }