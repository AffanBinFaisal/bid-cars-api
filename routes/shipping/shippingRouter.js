// Importing necessary modules
const express = require("express");

// Creating an Express router
const router = express.Router();

// Importing middleware functions and shipping controller
const authenticateToken = require("../../middlewares/authenticateToken");
const adminOnly = require("../../middlewares/adminOnly");
const shippingController = require("../../controllers/shippingController");

// Routes for regular user operations

// Get a specific shipping by ID, requiring authentication
router.get("/:id", authenticateToken, shippingController.getShippingById);

// Get all shippings for the authenticated user with admin privileges, requiring admin authentication
router.get("/all", adminOnly, shippingController.getAllUserShippings);

// Get all active shippings for the authenticated user, requiring authentication
router.get("/active", authenticateToken, shippingController.getActiveShippings);

router.get(
  "/completed",
  authenticateToken,
  shippingController.getCompletedShippings
);

// Admin

router.get("/admin/all", adminOnly, shippingController.getAllShippings);

// Create a new shipping, requiring admin authentication
router.post("/admin/create", adminOnly, shippingController.createShipping);

router.post("/admin/update/:id", adminOnly, shippingController.updateShipping);

router.delete(
  "/admin/delete/:id",
  adminOnly,
  shippingController.deleteShipping
);

// Exporting the router for use in other parts of the application
module.exports = router;
