const express = require("express");
require('dotenv').config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const serverUrl = process.env.SERVER_URL;

const stripe = require("stripe")(stripeSecretKey);

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
}

const getSessionUrl = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const sessionURL = await createCheckoutSession(amount, description);
    res.status(200).json({ sessionURL });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getSessionUrl: getSessionUrl,
}
