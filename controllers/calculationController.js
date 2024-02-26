const TransportFee = require("./../models/TransportFee");

require("dotenv").config();

const oldCalculator = require("../utils/calculators/oldCalculator");
const newCalculator = require("../utils/calculators/newCalculator");

// Function to get destinations based on type
const getDestinations = async (req, res) => {
  try {
    const { type } = req.query;

    // Find destinations based on the provided type
    const destinations = await TransportFee.find({ type: type });

    // Respond with the retrieved destinations
    res.status(200).json({ destinations });
  } catch (error) {
    // Handle errors during destination retrieval
    console.error(error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

// Function to calculate transport fee using the old method
const oldCalculate = async (req, res) => {
  try {
    const { type, price, destination, terminal, auctionName } = req.query;

    // Check for required input parameters
    if (!type || !price || !destination || !terminal || !auctionName) {
      return res.status(400).json({ error: "Invalid Input" });
    }

    // Call the oldCalculator function to perform the calculation
    const calculation = await oldCalculator(type, price, destination, terminal, auctionName);

    // Respond with the calculated result
    res.status(200).json(calculation);

  } catch (error) {
    // Handle errors during calculation
    console.error(error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
}

// Function to calculate transport fee using the new method
const newCalculate = async (req, res) => {
  try {
    const { price, vin, destination } = req.query;

    // Check for required input parameters
    if (!price || !destination || !vin) {
      return res.status(400).json({ error: "Invalid Input" });
    }

    // Call the newCalculator function to perform the calculation
    const calculation = await newCalculator(price, vin, destination);

    // Respond with the calculated result
    res.status(200).json(calculation);

  } catch (error) {
    // Handle errors during calculation
    console.error(error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
}

module.exports = {
  getDestinations,
  oldCalculate,
  newCalculate,
}
