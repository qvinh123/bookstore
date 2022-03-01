const express = require("express")
const router = express.Router()
const { uploadBanner, getBanners, getBannerDetails } = require("../controllers/bannerController")
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.route("/banners").get(getBanners)
router.route("/products/banners/:productId").get(getBannerDetails)
router.route("/product/banner/upload").post(isAuthenticatedUser, authorizeRoles("admin"), uploadBanner)

module.exports = router