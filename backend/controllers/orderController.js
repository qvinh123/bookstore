const catchAsyncError = require("../middlewares/catchAsyncError")
const ErrorHandler = require("../utils/errorHandler")
const Order = require("../models/orderModel")
const Product = require("../models/productModel")
const APIFeatures = require("../utils/apiFetures")

// route :  POST api/order/new
// desc  :  create new order
// access:  private - User
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const { shippingInfo, itemsPrice, shippingPrice, totalPrice, paymentInfo, orderItems } = req.body

    if (!shippingInfo || !itemsPrice || !shippingPrice || !totalPrice || !paymentInfo) {
        return next(new ErrorHandler("Đơn hàng chưa thể hoàn tất. Vui lòng kiểm tra lại thông tin đơn hàng", 400))
    }

    if (orderItems && orderItems.length === 0) {
        return next(new ErrorHandler("Không có sản phẩm đặt hàng", 400))
    }

    const newOrder = await Order.create({
        shippingInfo,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        orderItems,
        user: req.user,
        paidAt: Date.now()
    })

    const order = await Order.findById(newOrder._id)
    order.orderItems.forEach(async (order) => await updateStock(order.product, order.quantity))

    res.status(200).json({
        success: true,
        message: 'Đơn hàng hoàn tất'
    })
})

// route :  GET api/admin/orders/search
// desc  :  search order
// access:  private - Admin
exports.getOrdersSearch = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)
    const sort = APIFeatures.sort(req.query)
    const match = APIFeatures.filter(req.query)

    const orders = await Order.find({ _id: req.query.keyword, ...match }).skip(skip).limit(resultPerPage).sort(sort)

    const ordersCount = await Order.count({ _id: req.query.keyword, ...match })

    if (!orders) {
        return next(new ErrorHandler("Không tìm thấy đơn hàng", 404))
    }

    res.status(200).json({
        success: true,
        data: { orders },
        resultPerPage,
        ordersCount
    })
})

// route :  GET api/orders/:id
// desc  :  get single order
// access:  private - Admin
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email")

    if (!order) {
        return next(new ErrorHandler("Không tìm thấy đơn hàng", 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

// route :  GET api/orders/me
// desc  :  get logged in user orders
// access:  private - User
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const sort = APIFeatures.sort(req.query)
    const match = APIFeatures.filter(req.query)

    const orders = await Order.find({ user: req.user, ...match }).skip(skip).limit(resultPerPage).sort(sort)
    const ordersCount = await Order.count({ user: req.user, ...match })

    res.status(200).json({
        success: true,
        data: { orders },
        resultPerPage,
        ordersCount
    })
})


// route :  GET api/admin/orders
// desc  :  get all orders
// access:  private - Admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 24
    const skip = APIFeatures.panigation(req.query, resultPerPage)

    const sort = APIFeatures.sort(req.query)
    const match = APIFeatures.filter(req.query)

    const orders = await Order.find(match).skip(skip).limit(resultPerPage).sort(sort)
    const ordersCount = await Order.count(match)

    let amountPrice = 0
    const a = await Order.find({})
    a.forEach((order) => amountPrice += order.totalPrice)

    res.status(200).json({
        success: true,
        amountPrice,
        data: {
            orders
        },
        resultPerPage,
        ordersCount
    })
})

// route :  PATCH api/admin/orders/:id
// desc  :  update proccess order
// access:  private - Admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler("Không tìm thấy đơn hàng này", 404))
    }

    if (order.orderStatus === "đã giao") {
        return next(new ErrorHandler("Đơn hàng đã được giao. Không thể sửa đổi", 400))
    }

    // if (req.body.orderStatus === "đã giao") {
    // order.orderItems.forEach(async (order) => await updateStock(order.product, order.quantity))
    // }
    
    order.orderStatus = req.body.orderStatus
    order.deliveryAt = Date.now()

    await order.save()

    res.status(200).json({
        success: true
    })
})

// route :  DELETE api/admin/orders/:id
// desc  :  delete order
// access:  private - Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id)

    if (!order) {
        return next(new ErrorHandler("Không tìm thấy đơn hàng này", 404))
    }

    res.status(200).json({
        success: true,
        message: "Xóa đơn hàng thành công"
    })
})


async function updateStock(id, quantity) {
    const product = await Product.findById(id)

    product.stock = product.stock - quantity
    product.quantitySold = product.quantitySold + quantity

    await product.save({ validateBeforeSave: false })
}