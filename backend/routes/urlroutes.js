const express = require("express");

const {
  scanURL,
} = require("../controllers/urlController");

const router = express.Router();

router.post("/", scanURL);

module.exports = router;