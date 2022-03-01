const express = require('express')
const router = express.Router()
const { getProductsCategoryDetail, getAllCategory, createCategory, updateCategory } = require('../controllers/categoryController')
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.route("/categories").get(getAllCategory)
router.route("/admin/category/new").post(isAuthenticatedUser, authorizeRoles("admin"), createCategory)
router.route("/admin/categories/:id").patch(isAuthenticatedUser, authorizeRoles("admin"), updateCategory)
router.route("/categories/:slugCategory").get(getProductsCategoryDetail)

module.exports = router