const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const resetPasswordMail = require("./../utils/mails/resetPasswordMail");

const secretKey = process.env.JWT_SECRET;

router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const verificationToken = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

    user.verificationToken = verificationToken;
    await user.save();

    resetPasswordMail(email, verificationToken);

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;