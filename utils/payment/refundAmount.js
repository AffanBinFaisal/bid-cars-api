// Extracting the Stripe secret key from environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Importing the Stripe SDK and initializing it with the secret key
const stripe = require("stripe")(stripeSecretKey);

// Function to refund a specific amount for a payment intent
const refundAmount = async (paymentIntentId, remainingAmount) => {
  try {
    // Creating a refund using the Stripe API
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: remainingAmount,
    });

    // Returning the created refund object
    return refund;
  } catch (error) {
    // Logging the error and throwing it for further handling
    console.log(error);
    throw error;
  }
};

// Exporting the function for use in other parts of the application
module.exports = refundAmount;
