const express = require("express");
const router = express.Router();
const CarController = require("../../controllers/CarController");

router.get("/vin/:vin", CarController.getVehicleByVin);

router.get('/', CarController.getVehiclesByFilters);

router.get("/get-makes", CarController.getMakes);

router.get("/get-vehicles-type", CarController.getVehiclesType);

module.exports = router;
