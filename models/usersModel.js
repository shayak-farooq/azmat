const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: { type: String, unique: true },
    address: [
        {
            label: String, // e.g. "Home", "Office"
            houseNo: String,
            area: { type: String, required: true },
            landmark: String,
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        }
    ],
    updatedAt: Date

}, { timestamps: true })

module.exports = mongoose.model('user', userSchema)