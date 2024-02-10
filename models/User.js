const mongoose = require("./mongoose/mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  deposit: {
    type: Number,
  },
  balance: {
    type: Number
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
