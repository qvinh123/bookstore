const catchAsyncError = require("../middlewares/catchAsyncError")
const ErrorHandler = require("../utils/errorHandler")
const Categories = require("../models/categoryModel")
const APIFeatures = require("../utils/apiFetures")

// route :  GET api/categories
// desc  :  get all categories
// access:  public
exports.getAllCategory = catchAsyncError(async (req, res, next) => {
    const categories = await Categories.find({})

    res.status(200).json({
        success: true,
        data: {
            categories
        },
        categoriesCount: categories.length,
    })
})

// route :  PATCH api/admin/categories/:id
// desc  :  update name category
// access:  private
exports.updateCategory = catchAsyncError(async (req, res, next) => {
    const category = await Categories.findById(req.params.id)

    if (!category) {
        return next(new ErrorHandler('Không tìm thấy danh mục sản phẩm', 404))
    }

    category.name = req.body.name
    await category.save()

    res.status(200).json({
        success: true,
        message: "Cập nhật thành công",
    })
})

// route :  POST api/admin/category/new
// desc  :  add name category
// access:  private
exports.createCategory = catchAsyncError(async (req, res, next) => {
    const { name } = req.body

    const categories = await Categories.findOne({ name })
    if (categories) {
        return next(new ErrorHandler("Danh mục sản phẩm này đã được sử dụng", 400))
    }
    await Categories.create({ name: name })

    res.status(201).json({
        success: true
    })
})

// route :  GET api/categories/:slugCategory
// desc  :  get products of category detail
// access:  public
exports.getProductsCategoryDetail = catchAsyncError(async (req, res, next) => {

    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const sort = APIFeatures.sort(req.query)

    const match = APIFeatures.filter(req.query)

    const productsOfCategoriesOriginal = await Categories.findOne({ slugName: req.params.slugCategory }).populate({
        path: "products",
        match
    })

    if (!productsOfCategoriesOriginal) {
        return next(new ErrorHandler("Không tìm thấy sản phẩm danh mục sản phẩm này", 404))
    }

    const productsCount = productsOfCategoriesOriginal.toObject()

    const category = await productsOfCategoriesOriginal.populate({
        path: "products",
        options: {
            limit: resultPerPage,
            skip: skip,
            sort
        },
        match,
        select: "name price images tag priceOriginal slugName stock releaseDate object"
    })


    res.status(200).json({
        success: true,
        data: category,
        resultPerPage,
        productsCount: productsCount.products.length,
    })
})