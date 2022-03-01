const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Cart = mongoose.model("Cart", cartSchema)

module.exports = Cart