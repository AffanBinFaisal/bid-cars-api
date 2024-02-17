const express = require("express");
const router = express.Router();

const userController = require("../../controllers/userController");
const authenticateToken = require("../../middlewares/authenticateToken");
const verifyUser = require("../../middlewares/verifyUser");


router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.post('/forgot-password', userController.sendPasswordResetMail);
router.post('/change-password', authenticateToken, verifyUser, userController.sendPasswordChangeMail);
router.post('/reset-password/:token', userController.resetPassword);
router.get("/verify/:token",  userController.verifyToken);

module.exports = router;