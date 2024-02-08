require('dotenv').config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);

const User = require("../../models/User");
const Transaction = require("../../models/Transaction");
const Session = require("../models/Session");

const refundAmount = require("../../utils/payment/refundAmount");
const createCheckoutSession = require("./../utils/createCheckoutSession");

const getSessionUrl = async (req, res) => {
  try {
    const { email } = req.user;
    const { amount, description } = req.body;
    const session = await createCheckoutSession(amount, description);
    const sessionUrl = session.url;
    const sessionId = session.id;
    const currentSession = await Session.findOne({ email: email });

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
      const canceledSession = await stripe.checkout.sessions.expire(currentSession.sessionId);
      currentSession.sessionId = sessionId;
      currentSession.sessionUrl = sessionUrl;
      await currentSession.save();
    }

    res.status(200).json({ sessionUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const withdrawAmount = async (req, res) => {
  try {
    const { email } = req.body;
    const { amount } = req.body;

    const user = await User.findOne({ email: email });

    if (user.balance < amount) {
      res.status(400).json({ error: "Insufficient Fund" });
      return;
    }

    const transactions = await Transaction.find({
      email: email,
      refunded: false,
    }).sort({ balance: 1 });

    let remainingAmount = amount;

    for (const transaction of transactions) {
      const { paymentIntentId, balance } = transaction;

      if (transaction.balance >= remainingAmount) {
        try {
          const refund = await refundAmount(paymentIntentId, remainingAmount);
        } catch (refundError) {
          console.log(refundError);
          res.status(500).json({ error: `Internal Server Error: ${refundError.message}` });
          return;
        }

        transaction.balance -= remainingAmount;
        remainingAmount = 0;
        await transaction.save();
        break;
      } else {
        try {
          const refund = await refundAmount(paymentIntentId, balance);
        } catch (refundError) {
          console.log(refundError);
          res.status(500).json({ error: `Internal Server Error: ${refundError.message}` });
          return;
        }

        remainingAmount -= balance;
        transaction.balance = 0;
        transaction.refunded = true;
        await transaction.save();
      }
    }

    user.balance -= amount;
    await user.save();

    res.status(200).json({ message: `You have successfully withdrawn $${amount}` });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
}


module.exports = {
  getSessionUrl: getSessionUrl,
  withdrawAmount: withdrawAmount,
}
