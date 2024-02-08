const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const Bid = require("../../models/Bid");
const Shipping = require("../../models/Shipping");

router.post("/", async (req, res) => {
  try {
    const { email } = req.user;
    const { vehicle } = req.body;

    const bid = await Bid.findOne({ email: email, vehicle: vehicle });
    const user = await User.findOne({ email: email });

    if (bid && bid.result) {
      if (user.balance >= bid.totalCost) {
        user.deposit -= bid.totalCost;
        await user.save();

        bid.paid = true;
        await bid.save();

        const shipping = Shipping({
          vehicle: vehicle,
          active: true,
        });
        await shipping.save();

        res.status(200).json({
          message: "Payment successful. Shipping initiated.",
        });
      } else {
        res.status(400).json({
          error: "Insufficient balance",
        });
      }
    } else {
      res.status(400).json({
        error: "You didn't win the bid",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
