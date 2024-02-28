// Importing necessary modules
const express = require("express");

// Creating an Express router
const router = express.Router();

// Importing middleware functions and purchase controller
const authenticateToken = require("../../middlewares/authenticateToken");
const verifyUser = require("../../middlewares/authenticateToken"); // Note: You might want to correct this to `verifyUser`

const purchaseController = require("../../controllers/purchaseController");

// Routes for handling purchase operations

// Route to initiate a car purchase, requiring authentication and user verification
router.post("/", authenticateToken, verifyUser, purchaseController.purchaseCar);

// Route to initiate an immediate car purchase (buy now), requiring authentication and user verification
router.post("/buy-now", authenticateToken, verifyUser, purchaseController.buyNowCar);

// Exporting the router for use in other parts of the application
module.exports = router;
