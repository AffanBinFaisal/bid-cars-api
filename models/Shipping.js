const mongoose = require("./../mongoose/mongoose");

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
  vin: {
    type: String
  },
  status: {
    type: String,
  },
  
  active: {
    type: Boolean,
    default: false,
  },
  inProgress: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },

  images: [imageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Sale Origin
  saleOrigin: {
    type: String,
  },

  // Delivery to Branch
  receivingBranch: {
    type: String,
  },

  // Shipping
  finalDestination: {
    type: String,
  },
  shippingLine: {
    type: String,
  },
  vesselName: {
    type: String,
  },
  containerNo: {
    type: String,
  },

  // Inspection Information
  keys: {
    type: Boolean,
  },
  color: {
    type: String,
  },
  new: {
    type: Boolean,
  },
  damage: {
    type: Boolean,
  },
  running: {
    type: Boolean,
  },
  wheels: {
    type: Boolean,
  },
  airbag: {
    type: Boolean,
  },
  radio: {
    type: Boolean,
  },
});

const Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = { Image, Shipping };
