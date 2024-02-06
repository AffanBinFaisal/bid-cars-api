const express = require("express");
const Shipping = require("./../models/Shipping");

const getActiveShippings = async (req, res) => {
  try {
    const { username } = req.user;
    const shippings = await Shipping.find({ username: username, active: 1 });
    res.status(200).json({ shippings });
  } catch (error) {
    console.error("Error fetching shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getCompletedShippings = async (req, res) => {
  try {
    const { username } = req.user;
    const shippings = await Shipping.find({ username: username, active: 0 });
    res.status(200).json({ shippings });
  } catch (error) {
    console.error("Error fetching shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const createShipping = async (req, res) => {
  const { username } = req.user;
  const { vehicle, status } = req.body;
  try {
    const shipping = new Shipping({
      username: username,
      vehicle: vehicle,
      status: status,
      active: 1,
    });
    await shipping.save();
    res.status(200).end();
  } catch (error) {
    console.error("Error creating shipping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const updateShipping = async (req, res) => {
  const id = req.param.id;
  const { active, status } = req.body;
  try {
    const updatedBid = await Bid.findByIdAndUpdate(
      id,
      {
        $set: {

          active: false,
          status: status,
        },
      },
      { new: true }
    );
    res.status(200).end();
  } catch (error) {
    console.error("Error creating shipping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getActiveShippings,
  getCompletedShippings,
  createShipping,
  updateShipping,
}