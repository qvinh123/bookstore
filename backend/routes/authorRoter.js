const express = require('express')
const router = express.Router()
const { newAuthor, getAllAuthors, getProductsOfAuthorDetail, updateAuthor, deleteAuthor, searchAuthor } = require('../controllers/authorController')
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.route("/admin/author/new").post(isAuthenticatedUser, authorizeRoles("admin"), newAuthor)
router.route("/admin/authors/:id").patch(isAuthenticatedUser, authorizeRoles("admin"), updateAuthor).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteAuthor)
router.route("/authors/search").get(searchAuthor)
router.route("/authors").get(getAllAuthors)
router.route("/authors/:slugAuthor").get(getProductsOfAuthorDetail)


module.exports = router