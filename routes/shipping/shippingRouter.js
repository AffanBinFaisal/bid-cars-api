const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middlewares/authenticateToken");
const adminOnly = require("../../middlewares/adminOnly");
const shippingController = require("../../controllers/shippingController");

router.get("/active", authenticateToken, shippingController.getActiveShippings);

router.get("/completed", authenticateToken,  shippingController.getCompletedShippings);

router.post("/", authenticateToken,  shippingController.createShipping);

// Admin

router.get("/all",adminOnly, shippingController.getAllShippings);

router.post("/update/:id", adminOnly , shippingController.updateShipping);

router.delete("/delete/:id", adminOnly , shippingController.deleteShipping);

module.exports = router;
