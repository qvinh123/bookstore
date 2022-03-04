const Author = require("../models/authorModel")
const Product = require("../models/productModel")

const catchAsyncError = require("../middlewares/catchAsyncError")

const ErrorHandler = require("../utils/errorHandler")
const APIFeatures = require("../utils/apiFetures")

const cloudinary = require("cloudinary")

// route :  POST api/admin/author/new
// desc  :  add new author
// access:  private
exports.newAuthor = catchAsyncError(async (req, res, next) => {

    const { avatar, name, description } = req.body

    const author = await Author.findOne({ name })

    if (author) {
        return next(new Error("Tên tác giả đã được sử dụng", 400))
    }

    if (avatar) {
        const result = await cloudinary.v2.uploader.upload(avatar, {
            folder: "author",
            width: 200,
            crop: "scale",
        })
        await Author.create({
            ...req.body,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            }
        })
    } else {
        await Author.create({ name, description })
    }


    res.status(200).json({
        success: true
    })
})

// route :  DELETE api/admin/authors/:id
// desc  :  delete author
// access:  private
exports.deleteAuthor = catchAsyncError(async (req, res, next) => {
    const author = await Author.findByIdAndDelete(req.params.id)

    if (!author) {
        return next(new ErrorHandler('Không tìm thấy tác giả', 404))
    }

    const image = author.avatar.public_id
    await cloudinary.v2.uploader.destroy(image)

    await Product.updateMany({ authors: { $in: [req.params.id] } }, {
        $pullAll: {
            authors: [req.params.id]
        }
    })

    res.status(200).json({
        success: true,
        message: "Xóa thành công"
    })
})

// route :  PATCH api/admin/authors/:id
// desc  :  update author
// access:  private
exports.updateAuthor = catchAsyncError(async (req, res, next) => {
    const author = await Author.findById(req.params.id)

    const newAuthor = {
        name: req.body.name,
        description: req.body.description,
    }

    if (!author) {
        return next(new ErrorHandler('Không tìm thấy tác giả', 404))
    }

    if (req.body.avatar) {
        const image = author.avatar.public_id
        await cloudinary.v2.uploader.destroy(image)

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "author",
            width: 200,
            crop: "scale",
        })
        newAuthor.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    await Author.findByIdAndUpdate(req.params.id, newAuthor, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        message: "Cập nhật thành công",
    })
})

// route :  GET api/authors/search
// desc  :  search name author
// access:  public
exports.searchAuthor = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const sort = APIFeatures.sort(req.query)
    const search = APIFeatures.search(req.query)

    const authors = await Author.find(search).skip(skip).limit(resultPerPage).sort(sort)
    const authorsCount = await Author.count(search)

    res.status(200).json({
        success: true,
        data: {
            authors
        },
        resultPerPage,
        authorsCount
    })
})

// route :  GET api/authors
// desc  :  get all authors
// access:  public
exports.getAllAuthors = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const sort = APIFeatures.sort(req.query)

    let authorsCount = await Author.count()

    const authors = await Author.find().skip(skip).limit(resultPerPage).sort(sort)
    authorsCount = await Author.count()

    res.status(200).json({
        success: true,
        data: {
            authors
        },
        resultPerPage,
        authorsCount
    })
})

// route :  GET api/authors/:slugAuthor
// desc  :  get products of author detail
// access:  public
exports.getProductsOfAuthorDetail = catchAsyncError(async (req, res, next) => {

    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const sort = APIFeatures.sort(req.query)

    const productsOfAuthorOriginal = await Author.findOne({ slugName: req.params.slugAuthor }).populate({
        path: "products",
    })

    if (!productsOfAuthorOriginal) {
        return next(new ErrorHandler("Không tìm thấy sản phẩm cho tác giả này", 404))
    }

    const productsCount = productsOfAuthorOriginal.toObject()

    const productsOfauthor = await productsOfAuthorOriginal.populate({
        path: "products",
        options: {
            limit: resultPerPage,
            skip: skip,
            sort
        },
        select: "name price images tag priceOriginal slugName stock releaseDate"
    })

    res.status(200).json({
        success: true,
        data: productsOfauthor,
        resultPerPage,
        productsCount: productsCount.products.length
    })
})