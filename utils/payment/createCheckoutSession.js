// Loading environment variables from a .env file
require('dotenv').config();

// Extracting necessary environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const serverUrl = process.env.SERVER_URL;

// Importing the Stripe SDK and initializing it with the secret key
const stripe = require("stripe")(stripeSecretKey);

// Function to create a Stripe Checkout session for payment
const createCheckoutSession = async (amount, description, email) => {
  try {
    // Creating a Checkout Session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: description,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      // Redirect URLs after successful payment or cancellation
      success_url: `${serverUrl}/payments/success?email=${email}`,
      cancel_url: `${serverUrl}/cancel`,
    });

    // Logging the created Checkout Session ID
    console.log('Checkout Session created:', session.id);

    // Returning the created session object
    return session;
  } catch (error) {
    // Handling errors and logging the error message
    console.error('Error creating Checkout Session:', error.message);

    // Throwing the error for further handling
    throw error;
  }
}

// Exporting the function for use in other parts of the application
module.exports = createCheckoutSession;
