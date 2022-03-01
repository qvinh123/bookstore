const express = require('express')
const router = express.Router()
const { getAllProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, getProductsSearch, getReviewsOfProduct } = require('../controllers/productController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route("/products").get(getAllProducts)

router.route("/products/:slugName").get(getSingleProduct)
router.route("/product/search").get(getProductsSearch)

router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), newProduct)

router.route("/admin/product/:id").patch(isAuthenticatedUser, authorizeRoles("admin"), updateProduct).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)

router.route("/product/reviews/:slug").get(getReviewsOfProduct)


module.exports = router