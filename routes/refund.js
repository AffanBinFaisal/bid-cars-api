const express = require("express");
require('dotenv').config();
const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);

router.post('/', async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    console.log(refund);

    res.status(200).json({ message: 'Refund processed successfully', refund });
  } catch (error) {
    consol.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;