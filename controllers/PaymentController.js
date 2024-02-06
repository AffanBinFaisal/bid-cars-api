const express = require("express");
require('dotenv').config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const serverUrl = process.env.SERVER_URL;

const stripe = require("stripe")(stripeSecretKey);

const Session = require("./../models/Session");

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
      success_url: `${serverUrl}/success`,
      cancel_url: `${serverUrl}/cancel`,
    });

    console.log('Checkout Session created:', session.id);
    return session;
  } catch (error) {
    console.error('Error creating Checkout Session:', error.message);
    throw error;
  }
}

const getSessionUrl = async (req, res) => {
  try {
    const { email } = req.user;
    const { amount, description } = req.body;
    const session = await createCheckoutSession(amount, description);
    const sessionUrl = session.url;
    const sessionId = session.id;
    const currentSession = Session.findOne({ email: email });
    if (!currentSession) {
      const newSession = Session(
        {
          email: email,
          sessionId: sessionId,
          sessionUrl: sessionUrl,
        }
      );
      await newSession.save();
    }else{
      currentSession.sessionId = sessionId;
      currentSession.sessionUrl = sessionUrl;
      await currentSession.save();
    }

    res.status(200).json({ sessionUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getSessionUrl: getSessionUrl,
}
