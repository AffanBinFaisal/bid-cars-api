const axios = require("axios");
require('dotenv').config();

const apiToken = process.env.API_TOKEN;

const getVehicleByVin = async (req, res) => {
  // 5UXKR0C52G0P21189
  try {
    const vinNumber = req.params.vin;
    const apiUrl = "https://copart-iaai-api.com/api/v1/get-car-vin";
    const carsResponse = await axios.post(apiUrl, {
      api_token: apiToken,
      vin_number: vinNumber,
    });

    const cars = carsResponse.data;
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const getVehiclesByFilters = async (req, res) => {
  try {
    console.log(req.query);
    const apiUrl = `https://copart-iaai-api.com/api/v2/get-active-lots`;
    const response = await axios.post(apiUrl, {
      api_token: apiToken,
      page:1,
      per_page:20,
      ...req.query,
    });

    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getMakes = async (req, res) => {
  try {
    const apiUrl = "https://copart-iaai-api.com/api/v1/get-makes";
    const response = await axios.post(apiUrl, {
      api_token: apiToken,
    });
    const data = response.data;
    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getModelByMake = async (req, res) => {
  const {id} = req.params;
  try {
    const apiUrl = `https://copart-iaai-api.com/api/v1/get-model-by-make/${id}`;
    const response = await axios.post(apiUrl, {
      api_token: apiToken,
    });
    const data = response.data;
    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getVehiclesType = async (req, res) => {
  try {
    const apiUrl = "https://copart-iaai-api.com/api/v1/get-vehicles-type";
    const response = await axios.post(apiUrl, {
      api_token: apiToken,
    });
    const data = response.data;
    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getVehicleByVin,
  getVehiclesByFilters,
  getMakes,
  getVehiclesType,
  getModelByMake
};