const {
  analyzeURLWithML,
} = require("../services/mlDetectionService");

const {
  analyzeURL,
} = require("../services/urlDetectionService");

const Scan = require("../models/Scan");


// =========================================
// SCAN URL
// =========================================

const scanURL = async (req, res) => {
  try {
    const { url } = req.body;


    // -------------------------------------
    // VALIDATION
    // -------------------------------------

    if (!url || !url.trim()) {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }


    const cleanedURL = url.trim();


    // -------------------------------------
    // 1. PYTHON URL ML MODEL
    // -------------------------------------

    const mlResult = await analyzeURLWithML(
      cleanedURL
    );


    // -------------------------------------
    // 2. EXISTING RULE-BASED ANALYSIS
    // -------------------------------------

    const ruleResult = analyzeURL(
      cleanedURL
    );


    // -------------------------------------
    // 3. COMBINE ML + RULE RESULTS
    // -------------------------------------

    let score = 5;

    let level = "SAFE";

    let category = "No Threat";


    if (
      mlResult.prediction === "phishing"
    ) {

      score = Math.max(
        Math.round(mlResult.confidence),
        ruleResult.score
      );

    } else {

      score = Math.min(
        Math.round(
          100 - mlResult.confidence
        ),
        ruleResult.score
      );

    }


    // Keep score between 0 and 98

    score = Math.min(
      Math.max(score, 0),
      98
    );


    // -------------------------------------
    // CLASSIFICATION
    // -------------------------------------

    if (score >= 60) {

      level = "HIGH RISK";

      category = "Phishing URL";

    } else if (score >= 30) {

      level = "SUSPICIOUS";

      category = "Suspicious URL";

    }


    // -------------------------------------
    // DETECTION REASONS
    // -------------------------------------

    const reasons = [

      `ML prediction: ${mlResult.prediction}`,

      `ML confidence: ${mlResult.confidence}%`,

      ...ruleResult.reasons,

    ];


    // -------------------------------------
    // SAVE TO MONGODB
    // -------------------------------------

    const scan = await Scan.create({

      userId: req.userId,

      type: "URL",

      target: cleanedURL,

      score,

      level,

      category,

      confidence: mlResult.confidence,

      reasons,

    });


    // -------------------------------------
    // SEND RESPONSE
    // -------------------------------------

    res.status(200).json({

      success: true,

      result: {

        url: cleanedURL,

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
      "URL scanning error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        error.message ||
        "Unable to analyze URL.",

    });

  }
};


module.exports = {
  scanURL,
};