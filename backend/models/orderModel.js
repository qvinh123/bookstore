const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    shippingInfo: {
        address: { type: String, required: true },
        district: { type: String, required: true },
        province: { type: String, required: true },
        phone: { type: String, required: true },
        wards: { type: String, required: true },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    orderItems: [
        {
            name: { type: String, required: true },
            slugName: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            priceOriginal: { type: Number, required: true },
            image: { type: String, required: true },
            product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" }
        }
    ],
    paymentInfo: {
        id: { type: String },
        status: { type: String }
    },
    paidAt: { type: Date },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    orderStatus: { type: String, required: true, enum: ["đang xử lí", "đang giao", "đã giao"], default: "đang xử lí" },
    deliveryAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order