const mongoose = require("./db/db");

const shippingSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  vehicle: {
    type: String,
  },
  status: {
    type: String,
  },
  active: {
    type: Boolean,
  },
});

const Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = Shipping;
