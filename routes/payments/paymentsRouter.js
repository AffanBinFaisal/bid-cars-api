// Importing necessary modules
const express = require("express");
require("dotenv").config();

// Creating an Express router
const router = express.Router();

// Importing middleware functions and payment controller
const authenticateToken = require("../../middlewares/authenticateToken");
const verifyUser = require("../../middlewares/verifyUser");
const paymentController = require("../../controllers/paymentController");

// Routes for handling payment operations

// Route to initiate a deposit, requiring authentication and user verification
router.post("/deposit", authenticateToken, verifyUser, paymentController.getSessionUrl);

// Route to initiate a withdrawal, requiring authentication and user verification
router.post("/withdraw", authenticateToken, verifyUser, paymentController.withdrawAmount);

// Route to handle successful payment processing
router.get("/success", paymentController.processPayment);

// Route to get a user's transaction history, requiring authentication and user verification
router.get("/", authenticateToken, verifyUser, paymentController.getTransactions);

// Exporting the router for use in other parts of the application
module.exports = router;
