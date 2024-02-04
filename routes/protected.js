const express = require("express");
const axios = require("axios");
const router = express.Router();

const authenticateToken = require("../middlewares/authenticate");

router.get("/", authenticateToken, async (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

module.exports = router;
