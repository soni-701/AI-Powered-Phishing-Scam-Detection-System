const Scan = require("../models/Scan");

const getAllReports = async (req, res) => {
  try {
    const reports = await Scan.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Reports error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch reports.",
    });
  }
};

module.exports = {
  getAllReports,
};