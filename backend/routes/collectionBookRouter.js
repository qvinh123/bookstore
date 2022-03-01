const express = require('express')
const { newCollectionBook, getProductsOfCollectionBookDetail, getAllCollectionBook, updateCollectionBook, deleteCollectionBook, searchCollectionBook } = require('../controllers/collectionBookController')
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")
const router = express.Router()

router.route("/admin/collectionBook/new").post(isAuthenticatedUser, authorizeRoles("admin"), newCollectionBook)
router.route("/admin/collectionBook/:id")
    .patch(isAuthenticatedUser, authorizeRoles("admin"), updateCollectionBook)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCollectionBook)
router.route("/collectionBooks/search").get(searchCollectionBook)
router.route("/collectionBook").get(getAllCollectionBook)
router.route("/collectionBook/:slugCollectionBook").get(getProductsOfCollectionBookDetail)

module.exports = router