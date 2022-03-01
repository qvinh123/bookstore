const mongoose = require('mongoose')

const bannerSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Sản phẩm không được bỏ trống"]
    },
    public_id: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Banner = mongoose.model('Banner', bannerSchema)

module.exports = Banner