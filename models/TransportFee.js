const mongoose = require("./../mongoose/mongoose");

const transportFeeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  field1: {
    type: String,
  },
  field2: {
    type: String,
  },
  field3: {
    type: Number,
  },
  savannah: {
    type: Number,
  },
  nj: {
    type: Number,
  },
  houston: {
    type: Number,
  },
  miami: {
    type: Number,
  },
  chicago: {
    type: Number,
  },
});

const TransportFee = mongoose.model('TransportFee', transportFeeSchema, "transport_fees");

module.exports = TransportFee;