const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./../models/User");

const router = express.Router();
const secretKey = 'your-secret-key';

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const usersList = await User.find({ username: username });
  if (usersList.length > 0) {
    const user = usersList[0];
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token });
    }
    else {
      res.status(401).json({ message: "Incorrect username or password" });
    }

  } else {
    res.status(401).json({ message: "User not found" });
  }

});

module.exports = router;
