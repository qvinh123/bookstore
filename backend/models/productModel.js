const mongoose = require('mongoose')
const nonAccentVietnamese = require('../utils/nonAccent')

const productSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Vui lòng nhập tên sản phẩm"],
        maxLength: [100, "Tên sản phẩm không được vượt quá 100 ký tự"],
        unique: true,
    },
    slugName: {
        type: String,
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        trim: true,
        required: [true, "Vui lòng nhập giá sản phẩm"],
    },
    priceOriginal: {
        type: Number,
        trim: true,
        required: [true, "Vui lòng nhập giá gốc sản phẩm"],
    },
    tag: {
        type: Number,
        trim: true,
        default: 0
    },
    rating: {
        type: Number,
        trim: true,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    authors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Author",
            trim: true,
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Vui lòng nhập danh mục sản phẩm"],
        ref: "Categories",
        trim: true
    },
    collectionBook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CollectionBook",
        default: null,
        trim: true,
    },
    object: [
        {
            type: String,
            required: [true, "Vui lòng nhập đối tượng"],
            trim: true,
        }
    ],
    numOfPage: {
        type: Number,
        default: 0,
        trim: true
    },
    format: {
        type: String,
        trim: true
    },
    weight: {
        type: Number,
        trim: true
    },
    framework: {
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        default: 0,
        trim: true
    },
    numOfReviews: {
        type: Number,
        default: 0,
        trim: true
    },
    quantitySold: {
        type: Number,
        default: 0,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

productSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "product",
})

productSchema.pre("save", async function () {
    const product = this

    if (product.isModified("name")) {
        product.slugName = nonAccentVietnamese(product.name)
    }
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product



