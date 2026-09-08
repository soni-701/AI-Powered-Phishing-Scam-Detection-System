const express = require("express");

const {
  scanMessage,
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");
const scanRateLimiter = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  scanRateLimiter,
  scanMessage
);

module.exports = router;