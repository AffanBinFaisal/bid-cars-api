const mongoose = require("./mongoose/mongoose");

const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
});

const Image = mongoose.model('Image', imageSchema);

const shippingSchema = new mongoose.Schema({
  email: {
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
    default: true,
  },
  images: [imageSchema]
});

const Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = { Image, Shipping };
