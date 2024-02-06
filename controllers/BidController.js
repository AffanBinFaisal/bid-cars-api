const express = require("express");
require('dotenv').config();

const Bid = require("./../models/Bid");
const User = require("./../models/User");
const sendMail = require("./../utils/mails/sendBidMail");

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
    const { biddingPower, totalBidsAmount } = user;

    // Extract request body details
    const { vehicle, amount, merchant } = req.body;
    var requiredBiddingPower;

    // Check bidding power based on the merchant
    if (merchant === "IAAI") {
      requiredBiddingPower = 1000;
      if (biddingPower < requiredBiddingPower) {

        console.log("Not enough bidding power for IAAI");
        return res.status(403).json({ error: "Not enough bidding power" });
      }
    } else if (merchant === "COPART") {
      requiredBiddingPower = amount <= 6000 ? 600 : 0.1 * amount;

      if (!(amount <= 6000 && biddingPower >= 600) ||
        !(amount > 6000 || biddingPower >= requiredBiddingPower)) {
        console.log("Not enough bidding power for Copart");
        return res.status(403).json({ error: "Not enough bidding power" });
      }
    }

    // Create a new bid
    const bid = new Bid({
      email: email,
      vehicle: vehicle,
      amount: amount,
      active: 1,
      requiredBiddingPower: requiredBiddingPower,
    });

    // Save the bid to the database
    await bid.save();

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        $inc: {
          biddingPower: -requiredBiddingPower,
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
    sendMail(email, vehicle);

    // Respond with success
    res.status(200).end();
  } catch (error) {
    console.error("Error creating bid:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const updateBid = async (req, res) => {
  try {
    const { email, id, result } = req.body;

    // Validate if 'id' is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }

    // Update bid
    const updatedBid = await Bid.findByIdAndUpdate(
      id,
      {
        $set: {
          result: result,
          active: 0,
        },
      },
      { new: true }
    );

    if (updatedBid) {
      console.log('Updated bid:', updatedBid);

      // Update user biddingPower
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        {
          $inc: {
            biddingPower: updatedBid.requiredBiddingPower,
          },
        },
        { new: true }
      );

      res.status(200).json({ message: 'Bid updated successfully', bid: updatedBid, user: updatedUser });
    } else {
      console.log('Bid not found');
      res.status(404).json({ error: 'Bid not found' });
    }
  } catch (error) {
    console.error('Error updating bid:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getCurrentBids,
  getWonBids,
  getLostBids,
  createBid,
  updateBid,
};
