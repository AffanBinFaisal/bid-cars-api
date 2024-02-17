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
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;