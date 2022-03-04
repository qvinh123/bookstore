const catchAsyncError = require("../middlewares/catchAsyncError")
const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const cloudinary = require("cloudinary")
const APIFeatures = require("../utils/apiFetures")
const Banner = require("../models/bannerModel")

// route :  GET api/products
// desc  :  get all products
// access:  public
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const sort = APIFeatures.sort(req.query)

    const match = APIFeatures.filter(req.query)

    let productsCount = await Product.countDocuments()

    const products = await Product.find(match, "name price images tag priceOriginal slugName stock releaseDate", { skip, limit: resultPerPage, sort })
    productsCount = await Product.count(match)

    res.status(200).json({
        success: true,
        data: {
            name: "Sách mới",
            products,
        },
        resultPerPage,
        productsCount
    })
})

// route :  GET api/product/search
// desc  :  get product search
// access:  public
exports.getProductsSearch = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const productsSearch = APIFeatures.search(req.query)

    const sort = APIFeatures.sort(req.query)

    const products = await Product.find(productsSearch, "name price images tag priceOriginal slugName releaseDate stock", { skip, limit: resultPerPage, sort })

    const productsCount = await Product.count(productsSearch)

    if (!products) {
        return next(new ErrorHandler("Không tìm thấy sản phẩm.", 404))
    }

    res.status(200).json({
        success: true,
        data: { products },
        resultPerPage,
        productsCount
    })
})


// route :  GET api/products/:slugName
// desc  :  get single product
// access:  public
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {

    const product = await Product.findOne({ slugName: req.params.slugName }).populate("collectionBook object authors category")

    if (!product) {
        return next(new ErrorHandler("Sản phẩm không được tìm thấy", 404))
    }

    res.status(200).json({
        success: true,
        product
    })
})


// route :  POST api/admin/product/new
// desc  :  new product
// access:  private - Admin
exports.newProduct = catchAsyncError(async (req, res, next) => {

    const isRequestValid = validateRequestByKeys(req, Product)
    if (!isRequestValid) return next(new ErrorHandler('Yêu cầu không hợp lệ', 400))

    let images = []
    images.push(req.body.images)

    let imagesLink = []

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "books",
            crop: "scale",
            responsive: true,
            width: 'auto',
        })

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLink

    let authors = []
    if (typeof req.body.authors === "string") {
        authors.push(req.body.authors)
    } else {
        authors = req.body.authors
    }

    req.body.authors = authors

    let objects = []
    if (typeof req.body.object === "string") {
        objects.push(req.body.object)
    } else {
        objects = req.body.object
    }

    req.body.object = objects
    req.body.user = req.user
    await Product.create(req.body)

    res.status(201).json({
        success: true
    })
})


// route :  PATCH api/admin/product/:id
// desc  :  udapte product
// access:  private
exports.updateProduct = catchAsyncError(async (req, res, next) => {

    const product = await Product.findOne({ slugName: req.params.id })

    if (!product) {
        return next(new ErrorHandler("Sản phẩm không được tìm thấy", 404))
    }

    const isRequestValid = validateRequestByKeys(req, Product)
    if (!isRequestValid) return next(new ErrorHandler('Yêu cầu không hợp lệ', 400))

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'books'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks
    }

    let authors = []
    if (req.body.authors !== undefined) {
        if (typeof req.body.authors === "string") {
            authors.push(req.body.authors)
        } else {
            authors = req.body.authors
        }

        req.body.authors = authors
    }

    let objects = []
    if (req.body.object !== undefined) {
        if (typeof req.body.object === "string") {
            objects.push(req.body.object)
        } else {
            objects = req.body.object
        }

        req.body.object = objects
    }

    const requestKeys = Object.keys(req.body)

    requestKeys.forEach((update) => {

        if (req.body["authors"][0] === '') {
            req.body["authors"] = []
        }

        if (req.body["object"][0] === '') {
            req.body["object"] = []
        }

        if (req.body["collectionBook"] === '') {
            req.body["collectionBook"] = null
        }

        product[update] = req.body[update]

    })
    await product.save()

    res.status(200).json({
        success: true,
        product
    })
})


// route :  DELETE api/admin/product/:id
// desc  :  delete product
// access:  private
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Sản phẩm không được tìm thấy", 404))
    }

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await Banner.findOneAndDelete({ product: req.params.id })

    res.status(200).json({
        success: true
    })
})


// route :  GET api/product/reviews/:slugName
// desc  :  get reviews of product detail
// access:  public
exports.getReviewsOfProduct = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 7
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const sort = APIFeatures.sort(req.query)
    const match = APIFeatures.filter(req.query)

    const totalReviews = await Product.findOne({ slugName: req.params.slug }).populate("reviews")

    const products = await Product.findOne({ slugName: req.params.slug }).populate(
        {
            path: "reviews",
            match,
            options: {
                sort,
                skip,
                limit: resultPerPage,
            }
        }
    )

    const reviewsCount = await Product.findOne({ slugName: req.params.slug }).populate(
        {
            path: "reviews",
            match,
        }
    )

    if (!products) {
        return next(new ErrorHandler("Không tìm thấy bình luận cho sản phẩm này", 404))
    }

    res.status(200).json({
        success: true,
        reviews: products.reviews,
        resultPerPage,
        reviewsCount: reviewsCount.reviews.length,
        totalReviews: totalReviews.reviews.length
    })

})

function validateRequestByKeys(req, model, unupdatableKeys = ['_id', '__v']) {
    const modelKeys = Object.keys(model.schema.paths);
    const requestKeys = Object.keys(req.body)
    const updatableKeys = modelKeys.filter(key => !unupdatableKeys.includes(key))
    const isRequestValid = requestKeys.every(key => updatableKeys.includes(key))
    return isRequestValid;
}