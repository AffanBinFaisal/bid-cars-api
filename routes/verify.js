const express = require("express");
const router = express.Router();
const User = require("./../models/User");

router.get("/:token", async (req, res) => {
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
});

module.exports = router;