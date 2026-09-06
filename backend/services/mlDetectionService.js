const axios = require("axios");

const ML_SERVICE_URL = "http://localhost:8000/predict";

const analyzeMessageWithML = async (message) => {
  try {
    const response = await axios.post(
      ML_SERVICE_URL,
      {
        message,
      },
      {
        timeout: 10000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "ML service connection error:",
      error.response?.data || error.message
    );

    throw new Error("ML service is unavailable.");
  }
};

module.exports = {
  analyzeMessageWithML,
};