const express = require("express");
const router = express.Router();
require('dotenv').config();

const authenticateToken = require("../../middlewares/authenticateToken");
const adminOnly = require("../../middlewares/adminOnly");
const BidController = require("../../controllers/BidController");

router.get("/current", authenticateToken, BidController.getCurrentBids);

router.get("/won", authenticateToken, BidController.getWonBids);

router.get("/lost", authenticateToken, BidController.getLostBids);

router.post("/", authenticateToken, BidController.createBid);

// Admin

router.post("/update", adminOnly, BidController.updateBid);

router.delete("/delete", adminOnly, BidController.deleteBid);

module.exports = router;
