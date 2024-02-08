const express = require("express");
const router = express.Router();

const userController = require("../../controllers/userController");

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.post('/forgot-password', userController.sendPasswordResetMail);
router.post('reset-password/:token', userController.resetPassword);
router.get("verify/:token", userController.verifyToken);

module.exports = router;