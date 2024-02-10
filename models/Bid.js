const mongoose = require("./mongoose/mongoose");

const bidSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
  },
  requiredBiddingPower: {
    type: Number,
  },
  vehicle: {
    type: String,
  },
  result: {
    type: Boolean,
  },
  active: {
    type: Boolean,
    default: true,
  },
  paid: {
    type: Boolean,
  },
  totalCost: {
    type: Number,
  },
  daysLeft: {
    type: Number,
  }
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
