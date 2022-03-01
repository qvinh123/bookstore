const express = require('express');
const router = express.Router();
const { registerUser, getProfileUser, getTokenUser, loginUser, logoutUser, updateProfile, updatePasswordProfile, forgetPasswordUser, resetPassword, refreshToken, allUsers, deleteUser, searchUser, updateUser } = require('../controllers/userController');
const { isAuthenticatedUser, verifyRefreshToken, authorizeRoles } = require('../middlewares/auth');

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(isAuthenticatedUser, logoutUser)
router.route("/refreshToken").get(verifyRefreshToken, refreshToken)
router.route("/me/token").get(verifyRefreshToken, getTokenUser)
router.route("/me").get(isAuthenticatedUser, getProfileUser)
router.route("/me/update").patch(isAuthenticatedUser, updateProfile)
router.route("/update/password").patch(isAuthenticatedUser, updatePasswordProfile)
router.route("/password/forget").post(forgetPasswordUser)
router.route("/password/reset/:resetPasswordToken").post(resetPassword)
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), allUsers)
router.route("/admin/users/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser).patch(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
router.route("/admin/search/user").get(isAuthenticatedUser, authorizeRoles("admin"), searchUser)

module.exports = router