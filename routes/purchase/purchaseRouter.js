const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const Bid = require("../../models/Bid");
const { Shipping } = require("../../models/Shipping");

const sendPurchaseMail = require("../../utils/mails/purchase/sendPurchaseMail");

const authenticateToken = require("../../middlewares/authenticateToken");
const verifyUser= require("../../middlewares/authenticateToken");

router.post("/", authenticateToken, verifyUser, async (req, res) => {
  try {
    const { email } = req.user;
    const { vehicle } = req.body;

    const bid = await Bid.findOne({ email: email, vehicle: vehicle });

    if (!bid || !bid.result) {
      res.status(400).json({
        error: "You didn't win the bid",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }


    if (user.balance <= (bid.totalCost - bid.requiredBiddingPower)) {
      res.status(400).json({
        error: "Insufficient balance",
      });
    }

    user.deposit -= bid.totalCost;
    await user.save();

    bid.paid = true;
    await bid.save();

    const shipping = Shipping({
      email: email,
      vehicle: vehicle,
    });
    await shipping.save();

    sendPurchaseMail(email, vehicle);
    res.status(200).json({
      message: "Payment successful. Shipping initiated.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});


router.post("", authenticateToken, verifyUser, (req,res)=>{
  
});

module.exports = router;
