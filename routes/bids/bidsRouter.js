const express = require("express");
const router = express.Router();
require('dotenv').config();

const authenticateToken = require("../../middlewares/authenticateToken");
const adminOnly = require("../../middlewares/adminOnly");
const bidController = require("../../controllers/bidController");

router.get("/current", authenticateToken, bidController.getCurrentBids);

router.get("/won", authenticateToken, bidController.getWonBids);

router.get("/lost", authenticateToken, bidController.getLostBids);

router.post("/", authenticateToken, bidController.createBid);

// Admin

router.get("/all", adminOnly, bidController.getAllBids);

router.post("/update", adminOnly, bidController.updateBid);

router.delete("/delete", adminOnly, bidController.deleteBid);

module.exports = router;
