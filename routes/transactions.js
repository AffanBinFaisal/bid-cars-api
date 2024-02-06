const express = require("express");
const router = express.Router();

const Transaction = require("./../models/Transaction");

router.get("/", async (req, res) => {
  
  const { email } = req.user;

  try {
    const transactions = await Transaction.find({ email: email }).exec();

    if (transactions.length > 0) {
      res.status(200).json({ transactions });
    } else {
      res.status(404).json({ message: "No transactions found" });
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
