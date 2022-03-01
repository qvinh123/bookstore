const catchAsyncError = require("../middlewares/catchAsyncError")
const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const cloudinary = require("cloudinary")
const Review = require("../models/reviewModel")

// route :  POST api/product/review
// desc  :  create review product
// access:  private
exports.newReview = catchAsyncError(async (req, res, next) => {
    const { rating, productId, review, images } = req.body

    let imagesArr = []
    let imagesLink = []

    if (typeof images === "string") {
        imagesArr.push(images)
    } else {
        imagesArr = images
    }

    if (images) {
        for (let i = 0; i < imagesArr.length; i++) {
            const result = await cloudinary.v2.uploader.upload(imagesArr[i], {
                folder: "Products Review",
                crop: "scale",
                responsive: true,
                width: 'auto',
            })

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
    }

    const product = await Product.findById(productId)

    let reviewOfProduct = await Review.find({ product: productId })

    const reviewEl = reviewOfProduct.find(p => p.user.toString() === req.user.toString())

    if (reviewEl) {
        if (reviewEl.images.length > 0) {
            for (let i = 0; i < reviewEl.images.length; i++) {
                await cloudinary.v2.uploader.destroy(reviewEl.images[i].public_id)
            }
        }
        reviewEl.review = review
        reviewEl.rating = +rating
        reviewEl.images = imagesLink
        reviewEl.createdAt = Date.now()
        reviewEl.isUpdated = true

        await reviewEl.save({ validateBeforeSave: false })

    } else {
        await Review.create({
            user: req.user,
            rating: +rating,
            review: review,
            images: imagesLink,
            product: productId
        })
        reviewOfProduct = await Review.find({ product: productId })
        product.numOfReviews = reviewOfProduct.length
    }

    product.rating = reviewOfProduct.reduce((acc, review) => acc + review.rating, 0) / reviewOfProduct.length

    await product.save({ validateBeforeSave: false })

    res.status(200).json({ success: true, message: "Thêm thành công" })
})

// route :  DELETE api/product/review/:id
// desc  :  delete review product
// access:  private
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const review = await Review.findById(req.params.id)

    if (!review) {
        return next(new ErrorHandler("Sản phẩm không được tìm thấy", 404))
    }

    for (let i = 0; i < review.images.length; i++) {
        await cloudinary.v2.uploader.destroy(review.images[i].public_id)
    }

    const productId = review.product

    await review.deleteOne({ _id: req.params.id })

    const product = await Product.findById(productId)

    const reviews = await Review.find({ product: productId })

    product.numOfReviews = reviews.length
    product.rating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        message: "Xóa thành công"
    })
})

// route :  UPDATE api/product/updateReview
// desc  :  update review product
// access:  private
exports.updateReview = catchAsyncError(async (req, res, next) => {
    const { id } = req.params

    const review = await Review.findById(id)
    const product = await Product.findById(review.product)

    if (!product) {
        return next(new ErrorHandler("Sản phẩm không được tìm thấy", 404))
    }

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (review) {
        if (images !== undefined) {
            for (let i = 0; i < review.images.length; i++) {
                await cloudinary.v2.uploader.destroy(review.images[i].public_id)
            }

            let imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: 'Products Review'
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })
            }
            req.body.images = imagesLinks
        }
    }

    await Review.findByIdAndUpdate(id, {
        $set: {
            rating: req.body.rating,
            review: req.body.review,
            images: req.body.images,
            createdAt: Date.now(),
            isUpdated: true,
        }
    }, { new: true })

    const reviewOfProduct = await Review.find({ product: review.product })

    product.rating = reviewOfProduct.reduce((acc, review) => acc + review.rating, 0) / reviewOfProduct.length

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        message: "Cập nhật thành công"
    })
})