const express = require('express')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/ProductRoutes')
const mongoose = require('mongoose');
require('dotenv/config')
const cors=require('cors')
const app = express()

//env 
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
//middlewares 
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//Routes
app.use('/api/user',userRoutes)
app.use('/api/products',productRoutes)

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})