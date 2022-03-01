const mongoose = require("mongoose");
const nonAccentVietnamese = require("../utils/nonAccent");

const collectionBookSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Vui lòng nhập tên bộ sách"],
        unique: true,
        trim: true
    },
    slugName: {
        type: String,
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

collectionBookSchema.virtual("products", {
    ref: "Product",
    localField: '_id',
    foreignField: 'collectionBook'
})


collectionBookSchema.pre("save", async function () {
    const collectionBook = this

    if (collectionBook.isModified("name")) {
        collectionBook.slugName = nonAccentVietnamese(collectionBook.name)
    }
})

const CollectionBook = mongoose.model("CollectionBook", collectionBookSchema)

module.exports = CollectionBook