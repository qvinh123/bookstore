const express = require('express')
const router = express.Router()
const { newReview, deleteReview, updateReview } = require('../controllers/reviewController')

const { isAuthenticatedUser } = require('../middlewares/auth')

router.route("/product/review").post(isAuthenticatedUser, newReview)
router.route("/product/review/:id").delete(isAuthenticatedUser, deleteReview).patch(isAuthenticatedUser, updateReview)

module.exports = router