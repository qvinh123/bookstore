const catchAsyncError = require("../middlewares/catchAsyncError")
const CollectionBook = require("../models/collectionBookModel")
const Product = require("../models/productModel")
const APIFeatures = require("../utils/apiFetures")
const ErrorHandler = require("../utils/errorHandler")

// route :  POST api/admin/collectionBook/new
// desc  :  add name series book
// access:  private
exports.newCollectionBook = catchAsyncError(async (req, res, next) => {
    const { name } = req.body

    await CollectionBook.create({ name: name })

    res.status(200).json({ success: true })
})

// route :  GET api/collectionBook
// desc  :  get all series books
// access:  public
exports.getAllCollectionBook = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const sort = APIFeatures.sort(req.query)

    const collectionBook = await CollectionBook.find().skip(skip).limit(resultPerPage).sort(sort)
    const collectionBookCount = await CollectionBook.count()

    res.status(200).json({
        success: true,
        data: {
            collectionBook
        },
        collectionBookCount,
        resultPerPage
    })
})

// route :  DELETE api/admin/collectionBook/:id
// desc  :  delete series book
// access:  private
exports.deleteCollectionBook = catchAsyncError(async (req, res, next) => {
    const collectionBook = await CollectionBook.findByIdAndDelete(req.params.id)

    if (!collectionBook) {
        return next(new ErrorHandler('Không tìm thấy bộ sách', 404))
    }

    await Product.updateMany({ collectionBook: req.params.id }, {
        $set: {
            collectionBook: null
        }
    })

    res.status(200).json({
        success: true,
        message: "Xóa thành công"
    })
})

// route :  PATCH api/admin/collectionBook/:id
// desc  :  update name series book
// access:  private
exports.updateCollectionBook = catchAsyncError(async (req, res, next) => {
    const collectionBook = await CollectionBook.findById(req.params.id)

    if (!collectionBook) {
        return next(new ErrorHandler('Không tìm thấy bộ sách', 404))
    }

    collectionBook.name = req.body.name
    await collectionBook.save()

    res.status(200).json({
        success: true,
        message: "Cập nhật thành công",
    })
})

// route :  GET api/collectionBooks/search
// desc  :  search name series book
// access:  public
exports.searchCollectionBook = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const sort = APIFeatures.sort(req.query)
    const search = APIFeatures.search(req.query)

    const collectionBook = await CollectionBook.find(search).skip(skip).limit(resultPerPage).sort(sort)
    const collectionBookCount = await CollectionBook.count(search)

    res.status(200).json({
        success: true,
        data: {
            collectionBook
        },
        resultPerPage,
        collectionBookCount
    })
})

// route :  GET api/collectionBook/:slugCollectionBook
// desc  :  get products of series book detail
// access:  public
exports.getProductsOfCollectionBookDetail = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const sort = APIFeatures.sort(req.query)

    let productsOfCollectionBookOriginal

    if (req.params.slugCollectionBook) {
        productsOfCollectionBookOriginal = await CollectionBook.findOne({ slugName: req.params.slugCollectionBook }).populate({
            path: "products",
        })
    }

    if (!productsOfCollectionBookOriginal) {
        return next(new ErrorHandler("Không tìm thấy đối tượng cho danh mục sản phẩm này", 404))
    }

    const productsCount = productsOfCollectionBookOriginal.toObject()

    const collectionBook = await productsOfCollectionBookOriginal.populate({
        path: "products",
        options: {
            skip,
            limit: resultPerPage,
            sort
        },
        select: "name price images tag priceOriginal slugName stock releaseDate"
    })

    res.status(200).json({
        success: true,
        data: collectionBook,
        resultPerPage,
        productsCount: productsCount.products.length
    })
})

