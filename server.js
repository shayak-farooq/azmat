const express = require('express')
const userRoutes = require('./routes/userRoutes')
const mongoose = require('mongoose');
require('dotenv/config')
const app = express()
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
// connect mongodb
if(!MONGO_URI){
    console.error("MONGO_URI missing from .env")
    process.exit(1)
}
mongoose.connect(MONGO_URI)
.then(()=> console.log("Mongodb connected successfully"))
.catch(err => {
    console.error("Mongodb connection error:",err)
    process.exit(1)
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api',userRoutes)

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})