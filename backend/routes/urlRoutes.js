const express = require("express");

const { scanURL } = require("../controllers/urlController");

const protect = require("../middleware/authMiddleware");
const scanRateLimiter = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  scanRateLimiter,
  scanURL
);

module.exports = router;