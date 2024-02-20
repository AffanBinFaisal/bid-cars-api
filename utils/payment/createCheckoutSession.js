require('dotenv').config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const serverUrl = process.env.SERVER_URL;

const stripe = require("stripe")(stripeSecretKey);

const createCheckoutSession = async (amount, description, email) => {
  try {

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: description,
          },
          unit_amount: amount*100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${serverUrl}/payments/success?email=${email}`,
      cancel_url: `${serverUrl}/cancel`,
    });

    console.log('Checkout Session created:', session.id);
    return session;
  } catch (error) {
    console.error('Error creating Checkout Session:', error.message);
    throw error;
  }
}

module.exports = createCheckoutSession;