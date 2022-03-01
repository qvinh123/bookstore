const catchAsyncError = require("../middlewares/catchAsyncError");
const Cart = require("../models/cartModel");
const ErrorHandler = require("../utils/errorHandler");

// route :  POST api/newCart
// desc  :  add cart
// access:  private
exports.addCart = catchAsyncError(async (req, res, next) => {
    const { product, quantity } = req.body

    if (!product) {
        return next(new ErrorHandler("Sản phẩm", 400))
    }

    const cart = await Cart.findOne({ user: req.user })

    if (Array.isArray(product)) {
        if (cart) {
            const not_intersection = product.filter((el) => !cart.products.find(x => el.product.toString() === x.product.toString()))

            const intersection = product.filter((el) => cart.products.find(x => el.product.toString() === x.product.toString()))

            if (intersection.length > 0) {
                cart.products.forEach(element => {
                    intersection.forEach(x => {
                        if (element.product.toString() === x.product.toString()) {
                            element.quantity = x.quantity
                        }
                    })
                })
                cart.products = cart.products.concat(not_intersection)
                await cart.save()
                res.status(201).json({
                    success: true,
                    message: "Cập nhật giỏ hàng thành công"
                })
            } else {
                product.forEach(x => cart.products.unshift({ product: x.product, quantity: x.quantity }))
                await cart.save()
                res.status(201).json({
                    success: true,
                    message: "Cập nhật giỏ hàng thành công"
                })
            }
        } else {
            //no cart for user, create new cart
            await Cart.create({
                user: req.user,
                products: product
            });

            res.status(201).json({
                success: true,
                message: "Đã thêm vào giỏ hàng"
            })
        }
    } else {
        if (cart) {
            //cart exists for user
            const itemIndex = cart.products.findIndex(p => p.product == product);

            if (itemIndex !== -1) {
                //product exists in the cart, update the quantity
                const productItem = cart.products[itemIndex];
                productItem.quantity = quantity;
                cart.products[itemIndex] = productItem;
            } else {
                //product does not exists in cart, add new item
                cart.products.unshift({ product, quantity });
            }
            await cart.save();
            res.status(201).json({
                success: true,
                message: "Cập nhật giỏ hàng thành công"
            })
        } else {
            //no cart for user, create new cart
            await Cart.create({
                user: req.user,
                products: [{ product, quantity }]
            });

            res.status(201).json({
                success: true,
                message: "Đã thêm vào giỏ hàng"
            })
        }
    }
})

// route :  GET api/carts
// desc  :  get cart of user
// access:  private
exports.getCarts = catchAsyncError(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user }).populate({
        path: 'products',
        populate: {
            path: 'product',
            select: "_id name slugName images price stock priceOriginal"
        }

    })

    if (cart) {
        res.status(200).json({
            success: true,
            carts: cart.products
        })
    } else {
        res.status(200).json({
            success: true,
            carts: []
        })
    }


})

// route :  DELETE api/carts/:productId
// desc  :  get cart of user
// access:  private
exports.deleteCart = catchAsyncError(async (req, res, next) => {
    const { productId } = req.params

    if (!productId) {
        return next(new ErrorHandler("Sản phẩm không hợp lệ", 400))
    }

    const cart = await Cart.findOne({ user: req.user })

    if (cart.products.length > 1) {
        await cart.updateOne({ "$pull": { "products": { "product": productId } } })
    } else {
        await cart.deleteOne({ user: req.user })
    }

    res.status(200).json({
        success: true,
        message: "Đã xóa khỏi giỏ hàng"
    })
})

exports.deleteAllCarts = catchAsyncError(async (req, res, next) => {
    await Cart.findOneAndDelete({ user: req.user })

    res.status(200).json({
        success: true,
        message: "Đã xóa tất cả giỏ hàng"
    })
})