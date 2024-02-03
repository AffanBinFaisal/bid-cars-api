const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./../models/User");

const router = express.Router();
const secretKey = 'your-secret-key';

router.post('/', async (req, res) => {
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


});
module.exports = router;
