const mongoose = require("mongoose")
const nonAccentVietnamese = require("../utils/nonAccent")

const categoriesSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Vui lòng nhập danh mục sản phẩm"],
        trim: true,
        unique: true,
    },
    slugName: {
        type: String
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

categoriesSchema.virtual("products", {
    ref: "Product",
    localField: '_id',
    foreignField: "category"
})

categoriesSchema.pre("save", async function () {
    const category = this

    if (category.isModified("name")) {
        category.slugName = nonAccentVietnamese(category.name)
    }
})


const Categories = mongoose.model("Categories", categoriesSchema)

module.exports = Categories