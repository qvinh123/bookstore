const User = require("../models/userModel")
const cloudinary = require('cloudinary')
const catchAsyncErrors = require("../middlewares/catchAsyncError")
const sendToken = require("../utils/jwtToken")
const ErrorHandler = require("../utils/errorHandler")
const { sendMail } = require("../utils/sendMail")
const crypto = require("crypto")
const redis_client = require("../redis_connect")
const Order = require("../models/orderModel")
const Cart = require("../models/cartModel")
const APIFeatures = require("../utils/apiFetures")
const Review = require("../models/reviewModel")

// route :  POST api/register
// desc  :  register a user
// access:  public
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, password, email, avatar } = req.body

    if (!name || !password || !email) {
        return next(new ErrorHandler("Vui lòng điền vào các ô trống", 400))
    }

    const emailExists = await User.findOne({ email })
    if (emailExists) {
        return next(new ErrorHandler("Email này đã tồn tại", 400))
    }

    const nameExists = await User.findOne({ name })
    if (nameExists) {
        return next(new ErrorHandler("Tên tài khoản này đã tồn tại", 400))
    }

    let user

    if (avatar) {
        const result = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatar",
            crop: "scale",
            responsive: true,
            width: 'auto',
        })
        user = await User.create({
            name,
            password,
            email,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            }
        })
    } else {
        user = await User.create({
            name,
            password,
            email
        })
    }

    sendToken(user, 200, res)
})

// route :  POST api/login
// desc  :  login a user
// access:  public
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler("Vui lòng nhập email hoặc mật khẩu", 400))
    }

    const user = await User.findOne({ email })
    if (!user) {
        return next(new ErrorHandler("Email hoặc mật khẩu không hợp lệ", 401))
    }

    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Email hoặc mật khẩu không hợp lệ", 401))
    }

    sendToken(user, 200, res)

})

// route :  POST api/refreshToken
// desc  :  create new token and refresh token
// access:  private
exports.refreshToken = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user)
    sendToken(user, 200, res)
})


// route :  GET api/logout
// desc  :  logout user
// access:  private
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user)

    res.clearCookie('refresh_token')

    redis_client.del(user._id.toString())

    redis_client.set("BL_" + user._id.toString(), req.token)

    res.status(200).json({
        success: true,
        message: "Đăng xuất thành công"
    })
})

// route :  GET api/token
// desc  :  get token user
// access:  private
exports.getTokenUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user)

    redis_client.get("token_" + user._id.toString(), (err, data) => {
        if (err) throw err

        res.status(200).json({
            success: true,
            token: data
        })
    })
})

// route :  GET api/me
// desc  :  get proflie user
// access:  private
exports.getProfileUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user)

    if (!user) {
        return next(new ErrorHandler("Người dùng này không tồn tại", 400))
    }

    res.status(200).json({
        message: true,
        user
    })
})

// route :  PATCH api/me/update
// desc  :  update proflie user
// access:  private
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        email: req.body.email,
        name: req.body.name
    }

    if (req.body.avatar) {
        const user = await User.findById(req.user)

        const image = user.avatar.public_id

        await cloudinary.v2.uploader.destroy(image)

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatar",
            crop: "scale",
            responsive: true,
            width: 'auto',
        })
        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(req.user, newUserData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        user
    })
})

// route :  PATCH api/update/password
// desc  :  update password proflie user
// access:  private
exports.updatePasswordProfile = catchAsyncErrors(async (req, res, next) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body

    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("Mật khẩu cũ với mật khẩu mới không chính xác", 400))
    }

    const user = await User.findById(req.user)

    const isMatch = await user.comparePassword(oldPassword)
    if (!isMatch) {
        return next(new ErrorHandler("Mật khẩu cũ không đúng", 400))
    }

    user.password = newPassword
    await user.save()

    sendToken(user, 200, res)

})

// route :  POST api/password/forget
// desc  :  forget password user
// access:  public
exports.forgetPasswordUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler("Không tìm thấy người dùng với email này", 404))
    }

    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`

    const content = `
    <p>Truy cập vào đường link dưới để đặt lại mật khẩu mới: </p>
    <a href=${resetUrl}>${resetUrl}</a>
    `

    try {
        await sendMail({
            email: user.email,
            subject: "VbOOKS khôi phục mật khẩu",
            html: content
        })

        res.status(200).json({
            success: true,
            message: `Đã gửi email tới: ${user.email}`
        })
    } catch (err) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(err.message, 500))
    }
})

// route :  POST api/password/reset/:token
// desc  :  reset password user
// access:  private
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetPasswordToken).digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler("Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Mật khẩu không hợp lệ", 400))
    }

    user.password = req.body.password

    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user, 200, res)
})

// route :  GET api/admin/users
// desc  :  get all users
// access:  private
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const sort = APIFeatures.sort(req.query)

    let usersCount = await User.count()

    const users = await User.find().skip(skip).limit(resultPerPage).sort(sort)

    usersCount = await User.count()

    res.status(200).json({
        success: true,
        data: {
            name: "Tất cả người dùng",
            users
        },
        usersCount,
        resultPerPage
    })
})

// route :  GET api/admin/search/user
// desc  :  search user
// access:  private
exports.searchUser = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const sort = APIFeatures.sort(req.query)

    const users = await User.find({ $or: [{ name: req.query.keyword }, { email: req.query.keyword }] }).skip(skip).limit(resultPerPage).sort(sort)

    const usersCount = await User.count({ $or: [{ name: req.query.keyword }, { email: req.query.keyword }] })

    res.status(200).json({
        success: true,
        data: { users },
        usersCount,
        resultPerPage
    })
})

// route :  DELETE api/admin/users/:id
// desc  :  delete user
// access:  private
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler("Không tìm thấy người dùng", 404))
    }

    // Remove avatar from cloudinary
    if (user.avatar.public_id) {
        const image_id = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(image_id);
    }

    await user.deleteOne({ _id: user._id })
    await Order.deleteOne({ user: user._id })
    await Cart.deleteOne({ user: user._id })
    await Review.deleteMany({ user: user._id })

    res.status(200).json({
        success: true,
    })
})

// route :  DELETE api/admin/users/:id
// desc  :  Update role user
// access:  private
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        role: req.body.role
    }

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})