const express = require("express");
const router = express.Router();
const authenticateToken = require("./../middlewares/authenticate");
const ShippingController = require("./../controllers/ShippingController");

router.get("/active", authenticateToken, ShippingController.getActiveShippings);

router.get("/completed", authenticateToken,  ShippingController.getCompletedShippings);

router.post("/", authenticateToken,  ShippingController.createShipping);

router.post("/update/:id", authenticateToken, ShippingController.updateShipping);

module.exports = router;
