const rateLimit = require("express-rate-limit");

const scanRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30, // maximum 30 requests per IP
  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many scan requests. Please wait a few minutes and try again.",
  },
});

module.exports = scanRateLimiter;