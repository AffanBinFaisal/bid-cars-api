const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../models/User");
const sendVerificationMail = require("../utils/mails/auth/sendVerificationMail");
const sendResetPasswordMail = require("../utils/mails/auth/sendResetPasswordMail");
const secretKey = process.env.JWT_SECRET;

// Login user and generate JWT token
const loginUser = async (req, res) => {
  try {
    const { email: enteredEmail, password: 
    enteredPassword } = req.body;
    const user = await User.findOne({ email: enteredEmail });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      enteredPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    const { email, balance, verified } = user;
    const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });
    res.status(200).json({ token, email, balance, verified });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Register a new user
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please fill both email and password" });
  }

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Generate a verification token for email confirmation
  const verificationToken = Buffer.from(`${email}:${secretKey}`).toString(
    "base64"
  );

  // Hash the user's password before storing it
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user with hashed password and verification token
  const user = User({
    email: email,
    password: hashedPassword,
    verificationToken: verificationToken,
  });

  // Save the user to the database
  await user.save();

  // Generate JWT token for the registered user
  const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });

  // Send verification email
  sendVerificationMail(email, verificationToken);

  // Respond with token and user details
  res.status(200).json({ token, email, balance: 0, verified: false });
};

// Verify user email using a verification token
const verifyToken = async (req, res) => {
  console.log("In verification");
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ error: "Wrong Token" });
    }

    if (user.verified) {
      return res.status(400).json({ error: "User already verified" });
    }

    // Mark the user as verified
    user.verified = true;
    await user.save();

    const { email, verified, balance } = user;

    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Send a password reset email
const sendPasswordResetMail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a new verification token for password reset
    const verificationToken = jwt.sign({ email }, secretKey, {
      expiresIn: "1h",
    });

    // Update the user's verification token
    user.verificationToken = verificationToken;
    await user.save();

    // Send the password reset email
    sendResetPasswordMail(email, verificationToken);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Send a password change email
const sendPasswordChangeMail = async (req, res) => {
  const { email } = req.user;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a new verification token for password change
    const verificationToken = jwt.sign({ email }, secretKey, {
      expiresIn: "1h",
    });

    // Update the user's verification token
    user.verificationToken = verificationToken;
    await user.save();

    // Send the password change email
    sendResetPasswordMail(email, verificationToken);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Reset user password using a verification token
const resetPassword = async (req, res) => {
  const token = req.params.token;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ error: "Invalid token or user not found" });
    }

    if (!user.verified) {
      return res.status(401).json({ error: "User not verified" });
    }

    // Hash the new password and update user details
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = newHashedPassword;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  loginUser,
  registerUser,
  verifyToken,
  sendPasswordResetMail,
  sendPasswordChangeMail,
  resetPassword,
};
