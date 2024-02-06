const mongoose = require("./db/db");

const transactionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
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
