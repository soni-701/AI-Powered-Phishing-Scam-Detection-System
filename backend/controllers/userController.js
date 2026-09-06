const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Users error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch users.",
    });
  }
};

module.exports = {
  getAllUsers,
};