const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("./../models/User");

router.get("/:vin", async (req, res) => {
  // 5UXKR0C52G0P21189
  const vinNumber = req.params.vin;
  try {
    const carsResponse = await axios.post("https://copart-iaai-api.com/api/v1/get-car-vin", {
      api_token: "3e23a1f48c83bf8ac31386723c4f719c60123b1e37298ec2ec24835e1af2922e",
      vin_number: vinNumber,
    });

    const cars = carsResponse.data;

    console.log(cars);
    res.status(200).json({ message: "Good" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
