require("dotenv").config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);

const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Session = require("../models/Session");

const refundAmount = require("../utils/payment/refundAmount");
const createCheckoutSession = require("../utils/payment/createCheckoutSession");

const sendCashDepositMail = require("../utils/mails/payments/sendCashDepositMail");
const sendCashWithdrawalMail = require("../utils/mails/payments/sendCashWithdrawalMail");

// Get the Stripe Checkout session URL for payment initiation
const getSessionUrl = async (req, res) => {
  try {
    const { email } = req.user;
    const { amount, description } = req.body;

    // Create a new Checkout session and retrieve session URL
    const session = await createCheckoutSession(amount, description, email);
    const { url: sessionUrl, id: sessionId } = session;

    // Check if there is an existing session for the user
    const currentSession = await Session.findOne({ email: email });

    if (!currentSession) {
      // If no existing session, create a new one and save it
      const newSession = Session({
        email: email,
        sessionId: sessionId,
        sessionUrl: sessionUrl,
      });
      await newSession.save();
    } else {
      // If there is an existing session, check its status
      const currentRetrievedSession = await stripe.checkout.sessions.retrieve(
        currentSession.sessionId
      );

      // Expire the existing session if it's still open
      if (currentRetrievedSession.status == "open") {
        const canceledSession = await stripe.checkout.sessions.expire(
          currentSession.sessionId
        );
      }

      // Update the existing session with the new session details
      currentSession.sessionId = sessionId;
      currentSession.sessionUrl = sessionUrl;
      await currentSession.save();
    }

    // Respond with the session URL
    res.status(200).json({ sessionUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Withdraw funds from user's balance
const withdrawAmount = async (req, res) => {
  try {
    const { email } = req.user;
    const { amount } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email });

    // Check if user has sufficient balance
    if (user.balance < amount) {
      res.status(400).json({ error: "Insufficient Fund" });
      return;
    }

    // Find eligible transactions for refund
    const transactions = await Transaction.find({
      email: email,
      refunded: false,
    }).sort({ balance: 1 });

    let remainingAmount = amount;

    // Refund transactions to cover the withdrawal amount
    for (const transaction of transactions) {
      const { paymentIntentId, balance } = transaction;

      if (transaction.balance > remainingAmount) {
        try {
          const refund = await refundAmount(paymentIntentId, remainingAmount);
        } catch (refundError) {
          console.log(refundError);
          res
            .status(500)
            .json({ error: `Internal Server Error: ${refundError.message}` });
          return;
        }

        transaction.balance -= remainingAmount;
        remainingAmount = 0;
        await transaction.save();
        break;
      } else {
        // Refund the transaction amount and update transaction
        try {
          const refund = await refundAmount(paymentIntentId, balance);
        } catch (refundError) {
          console.log(refundError);
          res
            .status(500)
            .json({ error: `Internal Server Error: ${refundError.message}` });
          return;
        }

        remainingAmount -= balance;
        transaction.balance = 0;
        transaction.refunded = true;
        await transaction.save();
      }
    }

    // Deduct the withdrawn amount from user's balance
    user.balance -= amount;
    await user.save();

    // Send email notification for cash withdrawal
    sendCashWithdrawalMail(email, amount);

    res.status(200).json({
      amount: amount,
      message: `You have successfully withdrawn $${amount}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

// Process successful payment and update user's balance
const processPayment = async (req, res) => {
  try {
    const { email } = req.query;
    const currentSession = await Session.findOne({ email: email });
    const { sessionId } = currentSession;

    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the payment was successful
    if (session.payment_status === "paid") {
      const paymentIntentId = session.payment_intent;
      const amount = session.amount_total / 100;

      // Save transaction details to the database
      const transaction = new Transaction({
        email: email,
        amount: amount,
        currency: "usd",
        paymentIntentId: paymentIntentId,
        balance: amount,
      });

      await transaction.save();

      // Update user's balance and deposit
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          $inc: {
            balance: amount,
            deposit: amount,
          },
        },
        { new: true }
      );

      // Log user update status
      if (user) {
        console.log("User updated successfully:", user);
      } else {
        console.log("User not found");
      }

      // Delete the processed session record
      const deletedSession = await Session.deleteOne({ email: email });

      // Send email notification for cash deposit
      sendCashDepositMail(email, amount);

      res.status(200).json({ amount: amount, message: "Payment successfull" });
    } else {
      res.status(403).json({ error: "Payment not made" });
    }
  } catch (error) {
    console.error("Error handling successful payment:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get all transactions for the authenticated user
const getTransactions = async (req, res) => {
  const { email } = req.user;

  try {
    // Retrieve all transactions for the user
    const transactions = await Transaction.find({ email: email });

    // Check if transactions exist
    if (transactions.length > 0) {
      res.status(200).json({ transactions });
    } else {
      res.status(404).json({ message: "No transactions found" });
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getSessionUrl,
  withdrawAmount,
  processPayment,
  getTransactions,
};
