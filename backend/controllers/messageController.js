const {
  analyzeMessage,
} = require("../services/messageDetectionService");

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

    const result = analyzeMessage(message);

    const scan = await Scan.create({
      userId: req.userId,
      type: "MESSAGE",
      target: result.message,
      score: result.score,
      level: result.level,
      category: result.category,
      confidence: result.confidence,
      reasons: result.reasons,
    });

    res.status(200).json({
      success: true,
      result,
      scanId: scan._id,
    });

  } catch (error) {
    console.error("Message scanning error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to analyze message.",
    });
  }
};

module.exports = {
  scanMessage,
};