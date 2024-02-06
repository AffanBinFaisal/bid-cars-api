const express = require("express");
const Shipping = require("./../models/Shipping");

const getActiveShippings = async (req, res) => {
  try {
    const { email } = req.user;
    const shippings = await Shipping.find({ email: email, active: 1 });
    res.status(200).json({ shippings });
  } catch (error) {
    console.error("Error fetching shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getCompletedShippings = async (req, res) => {
  try {
    const { email } = req.user;
    const shippings = await Shipping.find({ email: email, active: 0 });
    res.status(200).json({ shippings });
  } catch (error) {
    console.error("Error fetching shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const createShipping = async (req, res) => {
  const { email } = req.user;
  const { vehicle, status } = req.body;
  try {
    const shipping = new Shipping({
      email: email,
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