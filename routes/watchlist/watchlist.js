const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middlewares/authenticate");
const Watchlist = require("../../models/Watchlist");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const watchlist = await Watchlist.find({ email: email });
    res.status(200).json({ watchlist });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const { vehicle } = req.body;
    const watchlist = new Watchlist({
      email: email,
      vehicle: vehicle,
    });
    await watchlist.save();
    res.status(200).end();
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
