const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const User = require("./../models/User");
const sendVerificationMail = require("./../utils/mails/sendVerificationMail");
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
      const user = User({ email: email, password: password, verificationToken: verificationToken, verified: false });
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

module.exports = {
  loginUser,
  registerUser,
};