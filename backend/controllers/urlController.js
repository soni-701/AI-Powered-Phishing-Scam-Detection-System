const {
  analyzeURLWithML,
} = require("../services/mlDetectionService");

const {
  analyzeURL,
} = require("../services/urlDetectionService");

const Scan = require("../models/Scan");

const scanURL = async (req, res) => {
  try {
    const { url } = req.body;

    // ==============================
    // BASIC VALIDATION
    // ==============================

    if (!url || typeof url !== "string" || !url.trim()) {
      return res.status(400).json({
        success: false,
        message: "URL is required.",
      });
    }

    const cleanedURL = url.trim();

    // ==============================
    // AI / ML ANALYSIS
    // ==============================

    const mlResult = await analyzeURLWithML(cleanedURL);

    // ==============================
    // RULE-BASED ANALYSIS
    // ==============================

    const ruleResult = analyzeURL(cleanedURL);

    // ==============================
    // INITIAL VALUES
    // ==============================

    let score = ruleResult.score;
    let level = ruleResult.level;
    let category = ruleResult.category;

    // ==============================
    // TRUSTED DOMAIN HANDLING
    // ==============================

    if (ruleResult.isTrustedDomain) {
      /*
       * A recognized trusted domain should not become
       * HIGH RISK only because the ML model produced
       * a false positive.
       */

      score = Math.min(ruleResult.score, 20);

      level = "SAFE";
      category = "No Threat";
    } else {
      // ==============================
      // NON-TRUSTED URL
      // ==============================

      if (mlResult.prediction === "phishing") {
        /*
         * Do not directly use 100% ML confidence
         * as the final score.
         *
         * Combine ML and rule-based evidence.
         */

        const mlScore = Math.round(mlResult.confidence);

        if (ruleResult.score >= 60) {
          score = Math.max(
            ruleResult.score,
            Math.round((mlScore + ruleResult.score) / 2)
          );
        } else {
          /*
           * When rules do not strongly support phishing,
           * limit the ML influence.
           */
          score = Math.max(
            ruleResult.score,
            Math.min(mlScore, 55)
          );
        }
      } else {
        /*
         * ML says legitimate.
         * Rule-based suspicious indicators still matter.
         */
        score = ruleResult.score;
      }

      score = Math.min(Math.max(score, 0), 98);

      // ==============================
      // FINAL RISK LEVEL
      // ==============================

      if (score >= 60) {
        level = "HIGH RISK";
        category = "Phishing URL";
      } else if (score >= 30) {
        level = "SUSPICIOUS";
        category = "Suspicious URL";
      } else {
        level = "SAFE";
        category = "No Threat";
      }
    }

    // ==============================
    // DETECTION REASONS
    // ==============================

    const reasons = [
      `ML prediction: ${mlResult.prediction}`,
      `ML confidence: ${mlResult.confidence}%`,
      ...ruleResult.reasons,
    ];

    // ==============================
    // TRUSTED DOMAIN REASON
    // ==============================

    if (ruleResult.isTrustedDomain) {
      reasons.unshift(
        "Trusted-domain protection prevented an ML false positive."
      );
    }

    // ==============================
    // SAVE RESULT
    // ==============================

    const scan = await Scan.create({
      userId: req.userId,
      type: "URL",
      target: cleanedURL,

      score,
      level,
      category,
      confidence: mlResult.confidence,

      prediction: mlResult.prediction,
      features: mlResult.features || [],

      reasons,
    });

    // ==============================
    // SEND RESULT
    // ==============================

    return res.status(200).json({
      success: true,

      result: {
        url: cleanedURL,

        score,
        level,
        category,
        confidence: mlResult.confidence,

        prediction: mlResult.prediction,

        features: mlResult.features || [],

        reasons,
      },

      scanId: scan._id,
    });
  } catch (error) {
    console.error("URL scanning error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to analyze URL.",
    });
  }
};

module.exports = {
  scanURL,
};