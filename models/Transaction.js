const mongoose = require("./mongoose/mongoose");

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
  balance: {
    type: Number,
  },
  refunded: {
    type: Boolean,
    default: false,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
