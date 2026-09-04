const express = require("express");

const {
  scanMessage,
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, scanMessage);

module.exports = router;