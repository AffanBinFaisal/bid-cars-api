const express = require("express");
const router = express.Router();
const User = require("./../models/User");

// Route to reset password
router.post('/reset-password/:token', async (req, res) => {
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
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear verification token
    user.password = hashedPassword;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;