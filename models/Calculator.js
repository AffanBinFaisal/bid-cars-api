const mongoose = require("./../mongoose/mongoose");

const calculatorSchema = new mongoose.Schema({
  auctionFee: {
    type: Number,
  },
  brokerFee: {
    type: Number,
  },
  environmentalFee: {
    type: Number,
  },
  premiumVehicleReport: {
    type: Number,
  },
  internetBidFee: {
    type: Number,
  },
  proxyBidFee: {
    type: Number,
  },
  oceanTransportation: {
    type: Number,
  },
  localTransportation: {
    type: Number,
  },
  gateFee: {
    type: Number,
  },
  liveBid: {
    type: Number,
  },
  total: {
    type: Number,
  },
  importDuty: {
    type: Number,
  },
  VAT: {
    type: Number,
  },
  totalCarPrice: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Calculator = mongoose.model("Calculator", calculatorSchema);

module.exports = Calculator;
