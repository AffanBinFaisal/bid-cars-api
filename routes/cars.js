const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("./../models/User");

const apiToken = "3e23a1f48c83bf8ac31386723c4f719c60123b1e37298ec2ec24835e1af2922e";

router.get("/:vin", async (req, res) => {
  // 5UXKR0C52G0P21189
  try {
    const vinNumber = req.params.vin;
    const url = "https://copart-iaai-api.com/api/v1/get-car-vin";
    const carsResponse = await axios.post(url, {
      api_token: apiToken,
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

router.get('/', async (req, res) => {
  try {
    const apiUrl = `https://copart-iaai-api.com/api/v2/get-cars`;
    const response = await axios.post(apiUrl, {
      params: {
        api_token: apiToken,
        ...req.query,
      },
    });

    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
