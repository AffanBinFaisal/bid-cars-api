const express = require("express");
const axios = require("axios");
require('dotenv').config();

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const serverUrl = process.env.SERVER_URL;

const stripe = require("stripe")(stripeSecretKey);

const Transaction = require("./../models/Transaction");
const User = require("./../models/User");
const authenticateToken = require("../middlewares/authenticate");

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { session_id, amount, description } = req.query;
    const { username } = req.user

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      const transaction = new Transaction({
        amount: amount,
        currency: 'usd',
        description: description,
      });

      await transaction.save();

      const user = await User.findOneAndUpdate({ username: "affan" }, { $set: { biddingPower: 10 } });

      console.log('Transaction saved to database:', transaction);

      res.status(200).json({ message: "Payment successfull" });
    } else {
      res.status(403).json({ message: "Payment not made" });
    }

  } catch (error) {
    console.error('Error handling successful payment:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;