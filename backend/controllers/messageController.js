const { analyzeMessageWithML } = require("../services/mlDetectionService");
const { analyzeMessage } = require("../services/messageDetectionService");
const Scan = require("../models/Scan");

const scanMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const cleanedMessage = message.trim();

    // ==========================================
    // 1. PYTHON ML PREDICTION
    // ==========================================

    const mlResult = await analyzeMessageWithML(
      cleanedMessage
    );

    // ==========================================
    // 2. RULE-BASED ANALYSIS
    // ==========================================

    const ruleResult =
      analyzeMessage(cleanedMessage);

    // ==========================================
    // 3. COMBINE ML + RULE RESULTS
    // ==========================================

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

    // ==========================================
    // 4. DETECTION REASONS
    // ==========================================

    const reasons = [
      `ML prediction: ${mlResult.prediction}`,
      `ML confidence: ${mlResult.confidence}%`,
      ...ruleResult.reasons,
    ];

    // ==========================================
    // 5. SAVE RESULT IN MONGODB
    // ==========================================

    const scan = await Scan.create({
      userId: req.userId,

      type: "MESSAGE",

      target: cleanedMessage,

      score,

      level,

      category,

      confidence:
        mlResult.confidence,

      // NEW
      prediction:
        mlResult.prediction,

      // MESSAGE DOES NOT USE URL FEATURES
      features: [],

      reasons,
    });

    // ==========================================
    // 6. SEND RESULT TO FRONTEND
    // ==========================================

    res.status(200).json({
      success: true,

      result: {
        message: cleanedMessage,

        score,

        level,

        category,

        confidence:
          mlResult.confidence,

        prediction:
          mlResult.prediction,

        reasons,
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