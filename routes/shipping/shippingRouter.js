const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middlewares/authenticateToken");
const adminOnly = require("../../middlewares/adminOnly");
const shippingController = require("../../controllers/shippingController");

router.get("/:id", authenticateToken, shippingController.getShippingById);

router.get("/all", adminOnly, shippingController.getAllUserShippings);

router.get("/active", authenticateToken, shippingController.getActiveShippings);

router.get(
  "/completed",
  authenticateToken,
  shippingController.getCompletedShippings
);

// Admin

router.get("/admin/all", adminOnly, shippingController.getAllShippings);

router.post("/admin/create", adminOnly, shippingController.createShipping);

router.post("/admin/update/:id", adminOnly, shippingController.updateShipping);

router.delete(
  "/admin/delete/:id",
  adminOnly,
  shippingController.deleteShipping
);

module.exports = router;
