const express = require("express");

const {
  getAllReports,
  downloadScanReport,
} = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all scan reports
router.get("/", protect, getAllReports);

// Download PDF report for a specific scan
router.get(
  "/:scanId/pdf",
  protect,
  downloadScanReport
);

module.exports = router;