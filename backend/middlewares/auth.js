const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken")
const ErrorHandler = require("../utils/errorHandler");
const redis_client = require("../redis_connect");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncError((req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
        return next(new ErrorHandler("Login first to access this resource.", 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SERCET)

    req.user = decoded._id
    req.token = token

    redis_client.get("BL_" + decoded._id.toString(), (err, data) => {
        if (err) throw err
        if (data === token) return next(new ErrorHandler("blacklisted token.", 401))
        next()
    })
})

exports.verifyRefreshToken = catchAsyncError(async (req, res, next) => {
    const { refresh_token } = req.cookies

    if (!refresh_token) {
        return next(new ErrorHandler("Invalid request.", 401))
    }

    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET)

    req.user = decoded._id

    redis_client.get(decoded._id.toString(), (err, data) => {
        if (err) throw err

        if (!data) return next(new ErrorHandler("Invalid request. Tokens is not in store.", 401))

        if (JSON.parse(data).refresh_token != refresh_token) return next(new ErrorHandler("Invalid request. Token is not same in store.", 401))
        next()
    })

})

exports.authorizeRoles = (...roles) => catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user)

    if (!roles.includes(user.role)) {
        return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403))
    }
    next()
})