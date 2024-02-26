// Importing necessary modules
const express = require("express");
const router = express.Router();
require('dotenv').config();

// Importing middleware functions and bid controller
const authenticateToken = require("../../middlewares/authenticateToken");
const adminOnly = require("../../middlewares/adminOnly");
const bidController = require("../../controllers/bidController");

// Routes for regular user operations

// Get a specific bid by ID
router.get("/:id", authenticateToken, bidController.getBidById);

// Get all bids for the authenticated user
router.get("/all", authenticateToken, bidController.getAllUserBids);

// Get all active bids for the authenticated user
router.get("/current", authenticateToken, bidController.getActiveBids);

// Get all won bids for the authenticated user
router.get("/won", authenticateToken, bidController.getWonBids);

// Get all lost bids for the authenticated user
router.get("/lost", authenticateToken, bidController.getLostBids);

// Create a new bid for the authenticated user
router.post("/create", authenticateToken, bidController.createBid);

// Admin Routes

// Get all bids (admin-only route)
router.get("/admin/all", adminOnly, bidController.getAllBids);

// Update a specific bid by ID (admin-only route)
router.post("/admin/update/:id", adminOnly, bidController.updateBid);

// Delete a specific bid by ID (admin-only route)
router.delete("/admin/delete/:id", adminOnly, bidController.deleteBid);

// Exporting the router for use in other parts of the application
module.exports = router;
