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

const createCheckoutSession = async (amount, description) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: description,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${serverUrl}/success?session_id=${session.id}&amount=${amount}&description=${description}`,
      cancel_url: `${serverUrl}/cancel`,
    });

    console.log('Checkout Session created:', session.id);
    return session.url;
  } catch (error) {
    console.error('Error creating Checkout Session:', error.message);
    throw error;
  }
};

router.get('/', authenticateToken, async (req, res) => {
  try {
    const sessionURL = await createCheckoutSession(1000, "Example");
    res.status(200).json({ sessionURL });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
