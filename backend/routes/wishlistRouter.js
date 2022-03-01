const express = require("express")
const { getWishList, addWishList, deleteWishList, deleteAllWishList } = require("../controllers/wishlistController")
const router = express.Router()
const { isAuthenticatedUser } = require("../middlewares/auth")

router.route("/wishlists").get(isAuthenticatedUser, getWishList)
router.route("/wishlist/new").post(isAuthenticatedUser, addWishList)
router.route("/wishlists/:productId").delete(isAuthenticatedUser, deleteWishList)
router.route("/deleteAllWishlist").delete(isAuthenticatedUser, deleteAllWishList)

module.exports = router