const express = require("express");
const router = express.Router();

const authenticateToken = require("../../middlewares/authenticateToken");
const verifyUser = require("../../middlewares/authenticateToken");

const purchaseController = require("../../controllers/purchaseController");


router.post("/", authenticateToken, verifyUser, purchaseController.purchaseCar);
router.post("/buy-now", authenticateToken, verifyUser, purchaseController.buyNowCar);

module.exports = router;
