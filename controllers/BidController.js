require('dotenv').config();

const mongoose = require("../models/mongoose/mongoose");

const Bid = require("../models/Bid");
const User = require("../models/User");
const sendBidMail = require("../utils/mails/bids/sendBidMail");
const sendBidConfirmationMail = require("../utils/mails/bids/sendBidConfirmationMail");
const sendBidWonMail = require("../utils/mails/bids/sendBidWonMail");
const sendBidLostMail = require("../utils/mails/bids/sendBidLostMail");

const fetchBids = async (req, res, resultFilter) => {
  try {
    const { email } = req.user;
    const bids = await Bid.find({ email: email, result: resultFilter });
    return bids;
  } catch (error) {
    console.error(`Error fetching bids: ${error}`);
    throw new Error("Internal Server Error");
  }
}

const getCurrentBids = async (req, res) => {
  try {
    const currentBids = await fetchBids(req, res, 1);
    res.status(200).json({ currentBids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getWonBids = async (req, res) => {
  try {
    const wonBids = await fetchBids(req, res, 1);
    res.status(200).json({ wonBids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getLostBids = async (req, res) => {
  try {
    const lostBids = await fetchBids(req, res, 0);
    res.status(200).json({ lostBids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const createBid = async (req, res) => {
  try {
    const { email } = req.user;

    // Fetch user details
    const user = await User.findOne({ email: email });
    const { balance } = user;

    // Extract request body details
    const { vehicle, amount, merchant } = req.body;

    const existingBid = await Bid.findOne({ email: email, vehicle: vehicle });
    if (existingBid) {
      return res.status(400).json({ error: "Bid already exists" });
    }

    var requiredBiddingPower;

    // Check bidding power based on the merchant
    if (merchant === "IAAI") {
      requiredBiddingPower = 1000;
      if (balance < requiredBiddingPower) {

        console.log("Not enough bidding power for IAAI");
        return res.status(403).json({ error: "Not enough bidding power" });
      }
    } else if (merchant === "COPART") {
      requiredBiddingPower = amount <= 6000 ? 600 : 0.1 * amount;

      if (!(amount <= 6000 && balance >= 600) ||
        !(amount > 6000 || balance >= requiredBiddingPower)) {
        console.log("Not enough bidding power for Copart");
        return res.status(403).json({ error: "Not enough bidding power" });
      }
    }

    // Create a new bid
    const bid = new Bid({
      email: email,
      vehicle: vehicle,
      amount: amount,
      requiredBiddingPower: requiredBiddingPower,
    });

    // Save the bid to the database
    await bid.save();

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        $inc: {
          balance: -requiredBiddingPower,
        }
      },
      { new: true } // to return the modified document
    );

    if (user) {
      console.log("User updated successfully:", user);
    } else {
      console.log("User not found");
    }

    // Send email notification
    sendBidMail(email, vehicle);
    sendBidConfirmationMail(email, vehicle);

    // Respond with success
    res.status(200).end();
  } catch (error) {
    console.error("Error creating bid:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const updateBid = async (req, res) => {
  try {
    const { id, result } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }

    const bid = await Bid.findById(id);

    if (bid) {

      if (bid.active) {

        const { email, vehicle, requiredBiddingPower } = bid;

        if (result == "true") {
          sendBidWonMail(email, vehicle);
        }
        else {
          const updatedUser = await User.findOneAndUpdate(
            { email: email },
            {
              $inc: {
                balance: requiredBiddingPower,
              },
            },
            { new: true }
          );

          sendBidLostMail(email, vehicle);
        }

        bid.result = result;
        bid.active = false;
        await bid.save();

        return res.status(200).json({ message: 'Bid updated successfully' });

      } else {

        return res.status(403).json({ message: 'Bid results have already been announced' });
      }

    } else {
      console.log('Bid not found');
      return res.status(404).json({ error: 'Bid not found' });
    }
  } catch (error) {
    console.error('Error updating bid:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const deleteBid = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedBid = await Bid.findByIdAndDelete(id);

    if (!deletedBid) {
      return res.status(404).json({ error: "Bid not found" });
    }

    res.status(200).end();
  } catch (error) {
    console.error("Error deleting bid:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getCurrentBids,
  getWonBids,
  getLostBids,
  createBid,
  updateBid,
  deleteBid,
};
