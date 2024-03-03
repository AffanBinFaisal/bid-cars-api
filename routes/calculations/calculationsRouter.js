// Importing necessary modules
const express = require("express");
const router = express.Router();

// Importing the calculations controller
const calculationsController = require("../../controllers/calculationController");

// Routes for calculations

// Get available destinations for calculations
router.get("/destinations", calculationsController.getDestinations);

// Calculate cost by old calculation method
router.get("/calculate-old", calculationsController.oldCalculate);

// Calculate cost by new calculation method
router.get("/calculate-new", calculationsController.newCalculate);

// Exporting the router for use in other parts of the application
module.exports = router;
