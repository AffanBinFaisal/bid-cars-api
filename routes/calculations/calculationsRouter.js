const express = require("express");
const router = express.Router();

const calculationsController = require("../../controllers/calculationController");

router.get("/destinations", calculationsController.getDestinations);
router.get("/calculate", calculationsController.calculateCost);
router.get("/calculate-total", calculationsController.calculateTotal);

module.exports = router;