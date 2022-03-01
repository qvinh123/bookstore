const sendToken = (user, statusCode, res) => {

    const token = user.getJWT()
    const refresh_token = user.generateRefreshToken()

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME_TOKEN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.status(statusCode).cookie("refresh_token", refresh_token, options).json({
        success: true,
        token,
        refresh_token,
        user
    })
}


module.exports = sendToken