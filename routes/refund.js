const express = require("express");
require('dotenv').config();
const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);

router.post('/', async (req, res) => {
  const { paymentIntentId } = req.body;

  Transaction.deleteOne({ paymentIntentId: paymentIntentId });

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    res.status(200).json({ message: 'Refund processed successfully', refund });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;