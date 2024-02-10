const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const User = require("../models/User");
const sendVerificationMail = require("../utils/mails/auth/sendVerificationMail");
const sendResetPasswordMail = require("../utils/mails/auth/sendResetPasswordMail");
const secretKey = process.env.JWT_SECRET;

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: "Incorrect email or password" });
      }
    } else {
      res.status(401).json({ error: "User not found" });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      const verificationToken = Buffer.from(`${email}:${secretKey}`).toString('base64');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = User({ email: email, password: hashedPassword, verificationToken: verificationToken });
      await user.save();
      const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
      sendVerificationMail(email, verificationToken);
      res.status(200).json({ token });
    }
    else {
      res.status(409).json({ message: "User already exists" });
    }
  } else {
    res.status(400).json({ message: "Please fill both email and password" });
  }
}

const verifyToken = async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ error: "Wrong Token" });
    }

    user.verified = true;
    await user.save();

    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const sendPasswordResetMail = async (req, res) => {

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const verificationToken = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

    user.verificationToken = verificationToken;
    await user.save();

    sendResetPasswordMail(email, verificationToken);

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const resetPassword = async (req, res) => {
  const token = req.params.token;
  const { newPassword } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const email = decodedToken.email;

    const user = await User.findOne({ email, verificationToken: token });

    if (!user) {
      return res.status(404).json({ error: 'Invalid token or user not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = newHashedPassword;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  loginUser,
  registerUser,
  verifyToken,
  sendPasswordResetMail,
  resetPassword,
};