const { analyzeURL } = require("../services/urlDetectionService");
const Scan = require("../models/Scan");

const scanURL = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }

    const result = analyzeURL(url);

    const scan = await Scan.create({
      userId: req.userId,
      type: "URL",
      target: result.url,
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
    console.error("URL scanning error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to analyze URL.",
    });
  }
};

module.exports = { scanURL };