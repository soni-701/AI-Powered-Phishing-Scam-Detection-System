const express = require("express");

const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const loginRateLimiter = require("../middleware/loginRateLimitMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post(
  "/login",
  loginRateLimiter,
  loginUser
);

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

module.exports = router;