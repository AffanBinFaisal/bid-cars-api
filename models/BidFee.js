const mongoose = require("./../mongoose/mongoose");

const bidFeeSchema = new mongoose.Schema({
  amount: {
    type: Number,
  },
  range: {
    type: String,
  },
  minPrice: {
    type: Number,
  },
  maxPrice: {
    type: Number,
  },
  internetBidFee: {
    type: Number,
  },
  proxyBidFee: {
    type: Number,
  },
  liveBidFee: {
    type: Number,
  },
});

const BidFee = mongoose.model("BidFee", bidFeeSchema, "bid_fees");

module.exports = BidFee;
