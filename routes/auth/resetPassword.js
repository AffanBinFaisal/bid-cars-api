const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

const User = require("../../models/User");

// Route to reset password
router.post('/:token', async (req, res) => {
  const token = req.params.token;
  const { newPassword } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const email = decodedToken.email;

    const user = await User.findOne({ email, verificationToken: token });

    if (!user) {
      return res.status(404).json({ error: 'Invalid token or user not found' });
    }

    // Hash the new password
    //const salt = await bcrypt.genSalt(10);
    //const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and clear verification token
    user.password = newPassword;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;