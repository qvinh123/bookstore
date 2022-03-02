const express = require('express');
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const middlewareErrors = require("./middlewares/errors")
const cors = require('cors')
const path = require('path')

const app = express(); 
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: "backend/config/config.env" })

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser())
app.use(fileUpload())
app.use(cors());

// import all routes
const productsRouter = require('./routes/productsRouter')
const authorRouter = require('./routes/authorRoter')
const categoryRouter = require('./routes/categoryRouter')
const userRouter = require('./routes/userRouter')
const cartRouter = require('./routes/cartRouter')
const wishlistRouter = require('./routes/wishlistRouter')
const orderRouter = require('./routes/orderRouter')
const collectionBookRouter = require('./routes/collectionBookRouter')
const paymentRouter = require('./routes/paymentRouter')
const reviewRouter = require('./routes/reviewRouter')
const bannerRouter = require('./routes/bannerRouter')

app.use("/api/v1", productsRouter)
app.use("/api/v1", reviewRouter)
app.use("/api/v1", authorRouter)
app.use("/api/v1", categoryRouter)
app.use("/api/v1", userRouter)
app.use("/api/v1", cartRouter)
app.use("/api/v1", wishlistRouter)
app.use("/api/v1", orderRouter)
app.use("/api/v1", collectionBookRouter)
app.use("/api/v1", paymentRouter)
app.use("/api/v1", bannerRouter)

if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, "../frontend/build")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
    })
}

// Middleware to handle error
app.use(middlewareErrors)

module.exports = app