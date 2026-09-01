const express = require("express");

const {
  scanMessage,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/", scanMessage);

module.exports = router;