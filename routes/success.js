const express = require("express");
const axios = require("axios");
require('dotenv').config();

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const serverUrl = process.env.SERVER_URL;

const stripe = require("stripe")(stripeSecretKey);

const Transaction = require("./../models/Transaction");
const User = require("./../models/User");
const Session = require("./../models/Session");

const authenticateToken = require("./../middlewares/authenticate");

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { email } = req.user
    const currentSession = Session.findOne({ email: email });
    const { sessionId, paymentIntentId } = currentSession;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const transaction = new Transaction({
        amount: amount,
        currency: 'usd',
        description: description,
        paymentIntentId: paymentIntentId
      });

      await transaction.save();

      const user = await User.findOneAndUpdate(
        { email: email },
        {
          $inc: {
            biddingPower: amount,
            deposit: amount
          }
        },
        { new: true }
      );

      if (user) {
        console.log("User updated successfully:", user);
      } else {
        console.log("User not found");
      }

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