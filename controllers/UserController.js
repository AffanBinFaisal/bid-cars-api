const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./../models/User");
require('dotenv').config();
const secretKey = 'your-secret-key';
const serverUrl = process.env.SERVER_URL

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
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
  const secretKey = 'your-secret-key';
  if (email && password) {
    const existingUsersList = User.find({ email: email });
    if (existingUsersList.length == 0) {
      const verificationToken = Buffer.from(`${email}:${secretKey}`).toString('base64');
      const user = User({ email: email, password: password, verificationToken: verificationToken, verified: false });
      await user.save();
      const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
      sendVerificationMail(recipient, verificationToken);
      res.status(200).json({ token });
    }
    else {
      res.status(409).json({ message: "User already exists" });
    }
  } else {
    res.status(400).json({ message: "Please fill both email and password" });
  }
}

module.exports = {
  loginUser,
  registerUser,
};