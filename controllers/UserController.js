const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./../models/User");
const secretKey = 'your-secret-key';

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const usersList = await User.find({ username: username });

    if (usersList.length > 0) {
      const user = usersList[0];

      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: "Incorrect username or password" });
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
  const { username, password } = req.body;
  if (username && password) {
    const existingUsersList = User.find({ username: username });
    if (existingUsersList.length == 0) {
      const user = User({ username: username, password: password });
      await user.save();
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token });
    }
    else {
      res.status(409).json({ message: "User already exists" });
    }
  } else {
    res.status(400).json({ message: "Please fill both username and password" });
  }
}

module.exports = {
  loginUser,
  registerUser,
};