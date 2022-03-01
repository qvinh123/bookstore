const express = require("express")
const { processPayment, getStripApi } = require("../controllers/paymentController")
const { isAuthenticatedUser } = require("../middlewares/auth")
const router = express.Router()

router.route("/payment/process").post(isAuthenticatedUser, processPayment)
router.route("/stripeapi").get(isAuthenticatedUser, getStripApi)

module.exports = router