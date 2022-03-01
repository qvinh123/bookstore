const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const redis_client = require('../redis_connect')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Vui lòng nhập tên tài khoản"],
        maxLength: [30, "Tên của bạn phải có ít nhất 30 ký tự"],
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Vui lòng nhập email"],
        validate: [validator.isEmail, "Email không hợp lệ"]
    },
    password: {
        type: String,
        required: [true, "Vui lòng nhập password"],
        minLength: [8, "Password ít nhất 8 ký tự"]
    },
    role: {
        type: String,
        default: "user"
    },
    avatar: {
        public_id: {
            type: String,
            default: "avatar/default_avatar"
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/quangvinhdlc/image/upload/v1646156366/avatar/default_avatar_edjl1o.jpg"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

userSchema.virtual("wishlist", {
    ref: "Wishlist",
    localField: '_id',
    foreignField: "user"
})

userSchema.pre("save", async function () {
    const user = this

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10)
    }
})

userSchema.methods.getJWT = function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SERCET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })

    redis_client.get("token_" + user._id.toString(), (err, data) => {
        if (err) throw err;

        redis_client.set("token_" + user._id.toString(), token);
    })

    return token
}

userSchema.methods.generateRefreshToken = function () {
    const user = this
    const refresh_token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME })

    redis_client.get(user._id.toString(), (err, data) => {
        if (err) throw err;

        redis_client.set(user._id.toString(), JSON.stringify({ refresh_token: refresh_token }));
    })

    return refresh_token
}


userSchema.methods.comparePassword = async function (enteredPassword) {
    const user = this

    return await bcrypt.compare(enteredPassword, user.password)
}

userSchema.methods.getResetPasswordToken = function () {
    const user = this

    const resetToken = crypto.randomBytes(20).toString("hex")

    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken
}

const User = mongoose.model("User", userSchema)
module.exports = User