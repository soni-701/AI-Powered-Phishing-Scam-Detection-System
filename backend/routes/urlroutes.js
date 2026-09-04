const express = require("express");

const { scanURL } = require("../controllers/urlController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, scanURL);

module.exports = router;