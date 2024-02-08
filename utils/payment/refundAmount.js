const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);

const refundAmount = async (paymentIntentId, remainingAmount) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: remainingAmount,
    });
    return refund;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = refundAmount;