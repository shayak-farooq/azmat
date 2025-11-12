const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    title:String,
    desc:String,
    price:Number,
    Rating:Number,
    catagory:String,
    stock:Number,
    netWeight:String,
    image:[String],
},{timestamps:true})

module.exports = mongoose.model('product',productSchema)