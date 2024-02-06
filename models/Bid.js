const mongoose = require("./db/db");

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
  },
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
