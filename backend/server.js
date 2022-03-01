const app = require('./app')
const cloudinary = require("cloudinary")
const connectDB = require('./config/db')

// Handle Uncaught exceptions => console.log(a)
process.on("uncaughtException", (err) => {
    console.log(`ERROR: ${err.stack}`)
    console.log("Shutting down due to Uncaught Exception")
    process.exit(1)
})

// Setting up config file
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: "backend/config/config.env" })

// connect mongoDB
connectDB()

// Setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})
