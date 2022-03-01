const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder, getOrdersSearch } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

const router = express.Router()

router.route("/order/new").post(isAuthenticatedUser, newOrder)

router.route("/orders/:id").get(isAuthenticatedUser, getSingleOrder)

router.route("/order/me").get(isAuthenticatedUser, myOrders)

router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders)

router.route("/admin/orders/search").get(isAuthenticatedUser, authorizeRoles("admin"), getOrdersSearch)

router.route("/admin/orders/:id")
    .patch(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)

module.exports = router