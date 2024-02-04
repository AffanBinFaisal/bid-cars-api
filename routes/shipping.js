const express = require("express");
const router = express.Router();
const authenticateToken = require("./../middlewares/authenticate");
const Shipping = require("./../models/Shipping");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { username } = req.user;
    const shippings = await Shipping.find({ username: username });
    res.status(200).json({ shippings });
  } catch (error) {
    console.error("Error fetching shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { username } = req.user;
  const { vehicle, status, active } = req.body;
  try {
    const shipping = new Shipping({
      username: username,
      vehicle: vehicle,
      status: status,
      active: active,
    });
    await shipping.save();
    res.status(200).end();
  } catch (error) {
    console.error("Error creating shipping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
