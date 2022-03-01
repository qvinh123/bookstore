const express = require('express');
const { addCart, getCarts, deleteCart, deleteAllCarts } = require('../controllers/cartController');
const router = express.Router()
const { isAuthenticatedUser } = require("../middlewares/auth")

router.route("/newCart").post(isAuthenticatedUser, addCart)
router.route("/carts").get(isAuthenticatedUser, getCarts)
router.route("/carts/:productId").delete(isAuthenticatedUser, deleteCart)
router.route("/deleteAllCart").delete(isAuthenticatedUser, deleteAllCarts)

module.exports = router