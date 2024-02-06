const mongoose = require("./db/db");

const transactionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
  },
  currency: {
    type: String,
  },
  description: {
    type: String,
  },
  paymentIntentId: {
    type: String,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
