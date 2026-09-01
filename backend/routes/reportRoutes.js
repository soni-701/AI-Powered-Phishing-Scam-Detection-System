const express = require("express");

const {
  getAllReports,
} = require("../controllers/reportController");

const router = express.Router();

router.get("/", getAllReports);

module.exports = router;