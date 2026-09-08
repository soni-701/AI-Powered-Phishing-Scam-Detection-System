const express = require("express");

const {
  getAllUsers,
  updateProfile,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all users
router.get("/", protect, getAllUsers);

// Update logged-in user's profile
router.put("/profile", protect, updateProfile);

module.exports = router;