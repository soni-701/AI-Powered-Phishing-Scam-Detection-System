const { analyzeMessageWithML } = require("../services/mlDetectionService");
const { analyzeMessage } = require("../services/messageDetectionService");
const Scan = require("../models/Scan");

const scanMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // =========================================
    // 1. BASIC VALIDATION
    // =========================================

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const cleanedMessage = message.trim();

    // =========================================
    // 2. MESSAGE LENGTH VALIDATION
    // =========================================

    const MAX_MESSAGE_LENGTH = 10000;

    if (cleanedMessage.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        success: false,
        message:
          "Message is too long. Please keep it under 10,000 characters.",
      });
    }

    // =========================================
    // 3. PYTHON ML PREDICTION
    // =========================================

    const mlResult = await analyzeMessageWithML(
      cleanedMessage
    );

    // =========================================
    // 4. RULE-BASED ANALYSIS
    // =========================================

    const ruleResult =
      analyzeMessage(cleanedMessage);

    // =========================================
    // 5. COMBINE ML + RULE RESULTS
    // =========================================

    let score = 5;
    let level = "SAFE";
    let category = "No Threat";

    if (mlResult.prediction === "spam") {
      score = Math.max(
        Math.round(mlResult.confidence),
        ruleResult.score
      );
    } else {
      score = Math.min(
        Math.round(100 - mlResult.confidence),
        ruleResult.score
      );
    }

    score = Math.min(
      Math.max(score, 0),
      98
    );

    if (score >= 60) {
      level = "HIGH RISK";
      category = "Scam Message";
    } else if (score >= 30) {
      level = "SUSPICIOUS";
      category = "Suspicious Message";
    }

    // =========================================
    // 6. DETECTION REASONS
    // =========================================

    const reasons = [
      `ML prediction: ${mlResult.prediction}`,
      `ML confidence: ${mlResult.confidence}%`,
      ...ruleResult.reasons,
    ];

    // =========================================
    // 7. SAVE RESULT IN MONGODB
    // =========================================

    const scan = await Scan.create({
      userId: req.userId,

      type: "MESSAGE",

      target: cleanedMessage,

      score,

      level,

      category,

      confidence: mlResult.confidence,

      prediction: mlResult.prediction,

      // Message scans do not use URL features
      features: [],

      reasons,
    });

    // =========================================
    // 8. SEND RESULT TO FRONTEND
    // =========================================

    res.status(200).json({
      success: true,

      result: {
        message: cleanedMessage,

        score,

        level,

        category,

        confidence: mlResult.confidence,

        prediction: mlResult.prediction,

        reasons,

        detectedIndicators:
          ruleResult.detectedIndicators || [],
      },

      scanId: scan._id,
    });

  } catch (error) {
    console.error(
      "Message scanning error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to analyze message.",
    });
  }
};

module.exports = {
  scanMessage,
};