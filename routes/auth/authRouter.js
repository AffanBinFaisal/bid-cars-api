// Importing necessary modules
const express = require("express");
const router = express.Router();

// Importing user controller and middleware functions
const userController = require("../../controllers/UserController");
const authenticateToken = require("../../middlewares/authenticateToken");
const verifyUser = require("../../middlewares/verifyUser");

// Route to handle user login
router.post("/login", userController.loginUser);

// Route to handle user registration
router.post("/register", userController.registerUser);

// Route to handle forgot password request
router.post("/forgot-password", userController.sendPasswordResetMail);

// Route to handle change password request (requires authentication and user verification)
router.post(
  "/change-password",
  authenticateToken,
  verifyUser,
  userController.sendPasswordChangeMail
);

// Route to handle password reset with token
router.post("/reset-password/:token", userController.resetPassword);

// Route to handle token verification
router.get("/verify/:token", userController.verifyToken);

// Exporting the router for use in other parts of the application
module.exports = router;
