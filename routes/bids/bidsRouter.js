const express = require("express");
const router = express.Router();
require('dotenv').config();

const authenticateToken = require("../../middlewares/authenticateToken");
const BidController = require("../../controllers/BidController");

router.get("/current", authenticateToken, BidController.getCurrentBids);

router.get("/won", authenticateToken, BidController.getWonBids);

router.get("/lost", authenticateToken, BidController.getLostBids);

router.post("/", authenticateToken, BidController.createBid);

router.post("/update", BidController.updateBid );

module.exports = router;
