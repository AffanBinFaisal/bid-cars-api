const mongoose = require("./../mongoose/mongoose");

const sessionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
  },
  sessionUrl: {
    type: String,
  },
  paymentIntent: {
    type: String,
  },
  paid: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;