const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middlewares/authenticateToken");
const adminOnly = require("../../middlewares/adminOnly");
const ShippingController = require("../../controllers/ShippingController");

router.get("/active", authenticateToken, ShippingController.getActiveShippings);

router.get("/completed", authenticateToken,  ShippingController.getCompletedShippings);

router.post("/", authenticateToken,  ShippingController.createShipping);

// Admin

router.post("/update/:id", adminOnly , ShippingController.updateShipping);

router.delete("/delete/:id", adminOnly , ShippingController.deleteShipping);

module.exports = router;
