const User = require('../models/usersModel')
const transporter = require('../services/NodeMailer');
const bcrypt = require('bcryptjs')
require('dotenv/config')

// Temporary storage
const tempStorage = {}
// delete temp storage after 10 minutes
function deleteTempStorage(store, key) {
    setTimeout(() => {
        console.log(`deleted`)
        delete store[key]
    }, 10 * 60 * 1000)
}
// otp generation function
function generateOTP() {
    const otp = Math.floor(Math.random() * 9000 + 1000)
    return otp
}

async function handleSignup(req, res) {
    try {
        const { name, email, password } = req.body
        console.log(req.body)
        const user = await User.find({ email })
        if (user.email) {
            return res.status(409).json({ err: "user already exists" })
        }
        // Hashing password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        let OTP = generateOTP()
        console.log(OTP)
        // storing name and hashed password
        tempStorage[email] = {
            name,
            hashedPassword,
            OTP
        }
        deleteTempStorage(tempStorage, email)
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP for Signup",
            text: `your OTP is ${OTP} valid for 10 minutes.\nplease Do not share it with anyone`, // plain‑text body
        });
        console.log("Message sent:", info.messageId);

        return res.status(200).json({ message: `otp sent successfully on ${email}`, email: email })
    }
    catch (err) {
        console.log(err)
    }
}
async function verifySignupOtp(req, res) {
    try {
        const { email, otp } = req.body
        if (!otp) {
            return res.status(403).json({ err: "otp is required" })
        }
        if (!tempStorage[email].OTP) {
            return res.status(403).json({ err: `otp expired` })
        }
        if (otp !== tempStorage[email].OTP) {
            return res.status(403).json({ err: `invalid otp` })
        }
        if (!tempStorage[email].name) {
            return res.status(403).json({ err: `user session expired` })
        }
        // save user to database
        await User.create({
            email: email,
            name: tempStorage[email].name,
            password: tempStorage[email].hashedPassword
        })
        // empty temporary storage after being used
        console.log(tempStorage[email])
        delete tempStorage[email]
        console.log(tempStorage[email])
        return res.end('signup successfull')
    } catch (err) {
        console.log(err);
    }
}
async function handleLogin(req, res) {
    try {
        const { email, password } = req.body
        console.log(email, password )
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ err: `invalid email` })
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.json({ err: `invalid email` })
        }
        res.status(200).json({ message: 'login successfully' })
    } catch (err) {

    }
}
async function handleForgetPassword(req, res) {
    const { email } = req.body
    console.log(email)
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ err: "email not found" })
    }
    let OTP = generateOTP()
    console.log(OTP)
    tempStorage[email] = { OTP }
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP for forget password",
        text: `your OTP is ${OTP} valid for 10 minutes.\nplease Do not share it with anyone`, // plain‑text body
    });
    console.log("Message sent:", info.messageId);
    return res.status(200).json({ message: `Otp sent on email:${email}` })
}

async function verifyForgetOtp(req, res) {
    const { email, otp } = req.body

    if (otp !== tempStorage[email].OTP) {
        return res.json({ err: "invalid otp" })
    }
    if (!tempStorage[email].OTP) {
        return res.json({ err: "OTP expired" })
    }
    return res.status(200).json({ message: "OTP verified" })
}
module.exports = { handleSignup, verifySignupOtp, handleLogin, handleForgetPassword, verifyForgetOtp }