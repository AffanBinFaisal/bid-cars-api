const User = require("./../models/User");
const Bid = require("./../models/Bid");
const { Shipping } = require("./../models/Shipping");

const sendPurchaseMail = require("./../utils/mails/purchase/sendPurchaseMail");

// Purchase a car using the winning bid
const purchaseCar = async (req, res) => {
  try {
    const { email } = req.user;
    const { vehicle } = req.body;

    // Find the bid associated with the user and vehicle
    const bid = await Bid.findOne({ email: email, vehicle: vehicle });

    // Check if the user won the bid
    if (!bid || !bid.result) {
      res.status(400).json({
        error: "You didn't win the bid",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email: email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // Check if the user has sufficient balance to make the payment
    if (user.balance <= (bid.totalCost - bid.requiredBiddingPower)) {
      res.status(400).json({
        error: "Insufficient balance",
      });
    }

    // Deduct the total cost from the user's balance
    user.balance -= bid.totalCost;
    await user.save();

    // Mark the bid as paid
    bid.paid = true;
    await bid.save();

    // Create a shipping record for the purchased vehicle
    const shipping = Shipping({
      email: email,
      vehicle: vehicle,
    });
    await shipping.save();

    // Send a purchase confirmation email
    sendPurchaseMail(email, vehicle);

    // Respond with success message
    res.status(200).json({
      message: "Payment successful. Shipping initiated.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Internal Server Error: ${error}` });
  }
}

// Purchase a car immediately with a fixed amount
const buyNowCar = async (req, res) => {
  try {
    const { email } = req.user;
    const { amount, vehicle } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // Check if the user has sufficient balance to make the payment
    if (user.balance <= amount) {
      return res.status(400).json({
        error: "Insufficient balance",
      });
    }

    // Deduct the fixed amount from the user's balance
    user.balance -= amount;
    await user.save();

    // Create a shipping record for the purchased vehicle
    const shipping = Shipping({
      email: email,
      vehicle: vehicle,
    });
    await shipping.save();

    // Send a purchase confirmation email
    sendPurchaseMail(email, vehicle);

    // Respond with success message
    res.status(200).json({
      message: "Payment successful. Shipping initiated.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Internal Server Error: ${error}` });
  }
}

module.exports = {
  purchaseCar,
  buyNowCar,
}
