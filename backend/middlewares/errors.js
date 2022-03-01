const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack
        })
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err }
        error.message = err.message

        // Handling Mongoose Validator Error
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map(value => value.message)
            error = new ErrorHandler(message, 400)
        }

        // Wrong Mongoose Object Id Error
        if (err.name === "CastError") {
            const message = `Resource not found. Invalid ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        // Handling Mongoose duplicate Error
        if (err.code === 11000) {
            const message = `${Object.keys(err.keyValue)} đã được sử dụng`
            error = new ErrorHandler(message, 400)
        }

        // Handling Expired JWT error
        if (err.name === 'TokenExpiredError') {
            const message = 'JSON Web Token is expired. Try Again!!!'
            error = new ErrorHandler(message, 401)
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || "Internal Server Error",
        })
    }
}