const express = require("express");

const {
  getAllReports,
} = require("../controllers/reportController");


const protect = require("../middleware/authMiddleware")

const router = express.Router();

router.get("/",protect, getAllReports);

module.exports = router;