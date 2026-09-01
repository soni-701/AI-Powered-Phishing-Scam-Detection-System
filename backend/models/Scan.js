const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["URL", "MESSAGE"],
      required: true,
    },

    target: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    level: {
      type: String,
      enum: ["SAFE", "SUSPICIOUS", "HIGH RISK"],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    confidence: {
      type: Number,
      required: true,
    },

    reasons: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Scan", scanSchema);