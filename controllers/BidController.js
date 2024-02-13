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

const getBidById = async (req, res) => {
  try {
    const { id } = req.params;
    const bid = await Bid.findById(id);

    if (!bid) {
      return res.status(404).json({ error: "Bid not found" });
    }

    res.status(200).json({ bid });
  } catch (error) {
    console.error(`Error fetching bid by ID: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


const getCurrentBids = async (req, res) => {
  try {
    const currentBids = await fetchBids(req, res, true);
    res.status(200).json({ currentBids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getWonBids = async (req, res) => {
  try {
    const wonBids = await fetchBids(req, res, true);
    if (!wonBids || wonBids.length === 0) {
      return res.status(404).json({ error: "No won bids found" });
    }
    res.status(200).json({ wonBids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getLostBids = async (req, res) => {
  try {
    const lostBids = await fetchBids(req, res, false);
    if (!lostBids || lostBids.length === 0) {
      return res.status(404).json({ error: "No lost bids found" });
    }
    res.status(200).json({ lostBids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getAllUserBids = async (req, res) => {
  try {
    const { email } = req.user;
    const allBids = await Bid.find({ email: email });
    if (!allBids || allBids.length === 0) {
      return res.status(404).json({ error: "No bids found" });
    }
    res.status(200).json({ allBids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const createBid = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email: email });
    const { balance } = user;

    const { vehicle, amount, merchant } = req.body;

    const existingBid = await Bid.findOne({ email: email, vehicle: vehicle });
    if (existingBid) {
      return res.status(400).json({ error: "Bid already exists" });
    }

    var requiredBiddingPower;

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

    const bid = new Bid({
      email: email,
      vehicle: vehicle,
      amount: amount,
      requiredBiddingPower: requiredBiddingPower,
    });

    await bid.save();

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        $inc: {
          balance: -requiredBiddingPower,
        }
      },
      { new: true }
    );

    if (user) {
      console.log("User updated successfully:", user);
    } else {
      console.log("User not found");
    }

    sendBidMail(email, vehicle);
    sendBidConfirmationMail(email, vehicle);

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

    if (!bid) {
      console.log('Bid not found');
      return res.status(404).json({ error: 'Bid not found' });
    }

    if (!bid.active) {
      return res.status(403).json({ message: 'Bid results have already been announced' });
    }

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

const getAllBids = async (req, res) => {
  const filters = req.query;
  try {
    const bids = await Bid.find(filters);
    res.status(200).json({ bids });
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

}

module.exports = {
  getBidById,
  getCurrentBids,
  getWonBids,
  getLostBids,
  getAllUserBids,
  createBid,
  updateBid,
  deleteBid,
  getAllBids,
};
