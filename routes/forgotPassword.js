const express = require("express");
const router = express.Router();
const User = require("./../models/User");

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const serverUrl = process.env.SERVER_URL;

// Route to request a password reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a new verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Save the new verification token
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