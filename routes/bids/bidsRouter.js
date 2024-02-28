const express = require("express");
const router = express.Router();
require("dotenv").config();

const authenticateToken = require("../../middlewares/authenticateToken");
const adminOnly = require("../../middlewares/adminOnly");
const bidController = require("../../controllers/bidController");

router.get("/:id", authenticateToken, bidController.getBidById);

router.get("/all", authenticateToken, bidController.getAllUserBids);

router.get("/current", authenticateToken, bidController.getActiveBids);

router.get("/won", authenticateToken, bidController.getWonBids);

router.get("/lost", authenticateToken, bidController.getLostBids);

router.post("/create", authenticateToken, bidController.createBid);

// Admin

router.get("admin/all", adminOnly, bidController.getAllBids);

router.post("admin/update", adminOnly, bidController.updateBid);

router.delete("admin/delete", adminOnly, bidController.deleteBid);

module.exports = router;
