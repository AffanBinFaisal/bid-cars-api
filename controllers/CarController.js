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
  const filters = { page: 1, per_page: 20, };

  try {
    for (const key in req.query) {
      var value = req.query[key];

      if (value == "All") {
        value = "";
      }
      if (value !== null && value !== undefined && value !== '') {
        const underscoreKey = key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
        filters[underscoreKey] = value.toUpperCase();
      }
    }

    const apiUrl = `https://copart-iaai-api.com/api/v2/get-active-lots`;
    const response = await axios.post(apiUrl, {
      api_token: apiToken,
      ...filters
    });

    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: `Internal Server Error: ${error}` });
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
  const { id } = req.params;
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