const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("./../models/User");

const apiToken = "3e23a1f48c83bf8ac31386723c4f719c60123b1e37298ec2ec24835e1af2922e";

router.get("/vin/:vin", async (req, res) => {
  // 5UXKR0C52G0P21189
  try {
    const vinNumber = req.params.vin;
    const apiUrl = "https://copart-iaai-api.com/api/v1/get-car-vin";
    const carsResponse = await axios.post(apiUrl, {
      api_token: apiToken,
      vin_number: vinNumber,
    });

    const cars = carsResponse.data;
    console.log(cars);
    res.status(200).json(cars);
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
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/get-makes", async (req, res) => {
  try {
    const apiUrl = "https://copart-iaai-api.com/api/v1/get-makes";
    const response = await axios.post(apiUrl, {
      api_token: apiToken,
    });
    const data = response.data;
    console.log(data);
    res.status(200).json(data);

  } catch(error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/get-vehicles-type", async (req, res) => {
  try {
    const apiUrl = "https://copart-iaai-api.com/api/v1/get-vehicles-type";
    const response = await axios.post(apiUrl, {
      api_token: apiToken,
    });
    const data = response.data;
    console.log(data);
    res.status(200).json(data);

  } catch(error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
