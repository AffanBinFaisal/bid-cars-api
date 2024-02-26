// Importing necessary modules
const express = require("express");
const router = express.Router();

// Importing the CarController
const CarController = require("../../controllers/CarController");

// Routes for interacting with vehicle information

// Get a vehicle by VIN (Vehicle Identification Number)
router.get("/vin/:vin", CarController.getVehicleByVin);

// Get vehicles based on filters
router.get('/', CarController.getVehiclesByFilters);

// Get available vehicle makes
router.get("/get-makes", CarController.getMakes);

// Get available vehicle types
router.get("/get-vehicles-type", CarController.getVehiclesType);

// Get vehicle models based on a specific make
router.get("/get-model-by-make/:id", CarController.getModelByMake);

// Exporting the router for use in other parts of the application
module.exports = router;
