const axios = require("axios");
require("dotenv").config();

const API_TOKEN = process.env.API_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL;

const handleRequestError = (error, res) => {
  console.error("Error fetching cars:", error);
  res.status(500).json({ error: `Internal Server Error: ${error}` });
};

const fetchData = async (apiUrl, body) => {
  try {
    const response = await axios.post(apiUrl, body);
    const data = response.data;
    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

const getVehicleByVin = async (req, res) => {
  // 5UXKR0C52G0P21189
  try {
    const vinNumber = req.params.vin;
    const apiUrl = `${API_BASE_URL}/v1/get-car-vin`;
    const body = {
      api_token: API_TOKEN,
      vin_number: vinNumber,
    };
    const car = await fetchData(apiUrl, body);
    if (car.result.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    handleRequestError(error, res);
  }
};

const getVehiclesByFilters = async (req, res) => {
  const filters = { page: 1, per_page: 50 };

  try {
    for (const key in req.query) {
      var value = req.query[key];

      if (value == "All") {
        value = "";
      }
      if (value !== null && value !== undefined && value !== "") {
        const underscoreKey = key
          .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
          .toLowerCase();
        filters[underscoreKey] = value.toUpperCase();
      }
    }

    const apiUrl = `${API_BASE_URL}/v2/get-active-lots`;
    const body = {
      api_token: API_TOKEN,
      ...filters,
    };
    const data = await fetchData(apiUrl, body);
    if (data.result.length === 0) {
      return res.status(404).json({ error: "Vehicles not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: `Internal Server Error: ${error}` });
  }
};

const getMakes = async (req, res) => {
  try {
    const apiUrl = `${API_BASE_URL}/v1/get-makes`;
    const body = {
      api_token: API_TOKEN,
    };
    const data = await fetchData(apiUrl, body);
    if (data.result.length === 0) {
      return res.status(404).json({ error: "Makes not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getModelByMake = async (req, res) => {
  const { id } = req.params;
  try {
    const apiUrl = `${API_BASE_URL}/v1/get-model-by-make/${id}`;
    const body = {
      api_token: API_TOKEN,
    };
    const data = await fetchData(apiUrl, body);
    if (data.result.length === 0) {
      return res.status(404).json({ error: "Models not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getVehiclesType = async (req, res) => {
  try {
    const apiUrl = `${API_BASE_URL}/v1/get-vehicles-type`;
    const body = {
      api_token: API_TOKEN,
    };
    const data = await fetchData(apiUrl, body);
    if (data.result.length === 0) {
      return res.status(404).json({ error: "Vehicle types not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getVehicleByVin,
  getVehiclesByFilters,
  getMakes,
  getVehiclesType,
  getModelByMake,
};
