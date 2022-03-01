const mongoose = require("mongoose");

const wishlistModel = mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
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

const Wishlist = mongoose.model("Wishlist", wishlistModel)

module.exports = Wishlist