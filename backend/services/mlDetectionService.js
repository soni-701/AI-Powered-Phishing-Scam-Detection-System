const axios = require("axios");

const ML_SERVICE_URL = "http://localhost:8000";


// =========================================
// SMS ML ANALYSIS
// =========================================

const analyzeMessageWithML = async (message) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/predict`,
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
      "SMS ML service connection error:",
      error.response?.data || error.message
    );

    throw new Error("SMS ML service is unavailable.");
  }
};


// =========================================
// URL ML ANALYSIS
// =========================================

const analyzeURLWithML = async (url) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/predict-url`,
      {
        url,
      },
      {
        timeout: 10000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "URL ML service connection error:",
      error.response?.data || error.message
    );

    throw new Error("URL ML service is unavailable.");
  }
};


// =========================================
// EXPORT
// =========================================

module.exports = {
  analyzeMessageWithML,
  analyzeURLWithML,
};