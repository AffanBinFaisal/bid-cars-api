const User = require("./../models/User");
const Bid = require("./../models/Bid");
const { Shipping } = require("./../models/Shipping");

const sendPurchaseMail = require("./../utils/mails/purchase/sendPurchaseMail");


const purchaseCar = async (req, res) => {
  try {
    const { email } = req.user;
    const { vehicle } = req.body;

    const bid = await Bid.findOne({ email: email, vehicle: vehicle });

    if (!bid || !bid.result) {
      res.status(400).json({
        error: "You didn't win the bid",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }


    if (user.balance <= (bid.totalCost - bid.requiredBiddingPower)) {
      res.status(400).json({
        error: "Insufficient balance",
      });
    }

    user.balance -= bid.totalCost;
    await user.save();

    bid.paid = true;
    await bid.save();

    const shipping = Shipping({
      email: email,
      vehicle: vehicle,
    });
    await shipping.save();

    sendPurchaseMail(email, vehicle);
    res.status(200).json({
      message: "Payment successful. Shipping initiated.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Internal Server Error: ${error}` });
  }
}


const buyNowCar = async (req, res) => {
  try {
    const { email } = req.user;
    const { amount, vehicle } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.balance <= amount) {
      return res.status(400).json({
        error: "Insufficient balance",
      });
    }

    user.balance -= amount;
    await user.save();

    const shipping = Shipping({
      email: email,
      vehicle: vehicle,
    });
    await shipping.save();

    sendPurchaseMail(email, vehicle);
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