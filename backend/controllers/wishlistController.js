const catchAsyncError = require("../middlewares/catchAsyncError");
const Wishlist = require("../models/wishlistModel");
const ErrorHandler = require("../utils/errorHandler")

// route :  POST api/wishlist/new
// desc  :  add new wishlist
// access:  private
exports.addWishList = catchAsyncError(async (req, res, next) => {
    const { product } = req.body

    if (!product) {
        return next(new ErrorHandler("Sản phẩm không được tìm thấy", 404))
    }

    const wishlist = await Wishlist.findOne({ user: req.user })

    if (wishlist) {
        wishlist.products.push({ product })
        await wishlist.save()
    } else {
        await Wishlist.create({
            user: req.user,
            products: [{ product }]
        })
    }

    res.status(200).json({
        success: true,
        message: "Đã thêm vào yêu thích"
    })
})

// route :  GET api/wishlists
// desc  :  get wishlists of user
// access:  private
exports.getWishList = catchAsyncError(async (req, res, next) => {
    const wishlist = await Wishlist.findOne({ user: req.user }).populate({
        path: "products",
        populate: {
            path: "product",
            select: "_id name slugName images price tag priceOriginal"
        }
    })

    if (wishlist) {
        res.status(200).json({
            success: true,
            wishlist: wishlist.products
        })
    } else {
        res.status(200).json({
            success: true,
            wishlist: []
        })
    }
})

// route :  DELETE api/wishlists/:productId
// desc  :  delete wishlist of user
// access:  private
exports.deleteWishList = catchAsyncError(async (req, res, next) => {
    const { productId } = req.params

    const wishlist = await Wishlist.findOne({ user: req.user })

    if (!wishlist) {
        return next(new ErrorHandler("wishlist not found.", 404))
    }

    if (wishlist.products.length > 1) {
        await wishlist.updateOne({ "$pull": { "products": { "product": productId } } })
    } else {
        await wishlist.deleteOne({ user: req.user })
    }

    res.status(200).json({
        success: true,
        message: "Xóa thành công"
    })
})


// route :  DELETE api/deleteAllWishlist
// desc  :  delete all wishlist of user
// access:  private
exports.deleteAllWishList = catchAsyncError(async (req, res, next) => {

    await Wishlist.findOneAndDelete({ user: req.user })

    res.status(200).json({
        success: true,
        message: "Xóa thành công"
    })
})