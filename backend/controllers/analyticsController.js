const Scan = require("../models/Scan");

const getAnalytics = async (req, res) => {
  try {
    const scans = await Scan.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    const recentScans = scans.slice(0, 5);

    // ==========================================
    // BASIC SCAN STATISTICS
    // ==========================================

    const totalScans = scans.length;

    const threatsDetected = scans.filter(
      (scan) => scan.score >= 60
    ).length;

    const suspiciousScans = scans.filter(
      (scan) => scan.score >= 30 && scan.score < 60
    ).length;

    const safeScans = scans.filter(
      (scan) => scan.score < 30
    ).length;

    const urlScans = scans.filter(
      (scan) => scan.type === "URL"
    ).length;

    const messageScans = scans.filter(
      (scan) => scan.type === "MESSAGE"
    ).length;

    const averageRisk =
      totalScans > 0
        ? Math.round(
            scans.reduce(
              (sum, scan) => sum + scan.score,
              0
            ) / totalScans
          )
        : 0;

    // ==========================================
    // ML PREDICTION STATISTICS
    // ==========================================

    const mlPredictions = {
      phishing: 0,
      legitimate: 0,
      spam: 0,
      ham: 0,
      unknown: 0,
    };

    scans.forEach((scan) => {
      if (scan.prediction === "phishing") {
        mlPredictions.phishing++;
      } else if (scan.prediction === "legitimate") {
        mlPredictions.legitimate++;
      } else if (scan.prediction === "spam") {
        mlPredictions.spam++;
      } else if (scan.prediction === "ham") {
        mlPredictions.ham++;
      } else {
        mlPredictions.unknown++;
      }
    });

    // ==========================================
    // ML TYPE STATISTICS
    // ==========================================

    const mlDetection = {
      url: {
        total: 0,
        phishing: 0,
        legitimate: 0,
      },

      message: {
        total: 0,
        spam: 0,
        ham: 0,
      },
    };

    scans.forEach((scan) => {
      if (scan.type === "URL") {
        mlDetection.url.total++;

        if (scan.prediction === "phishing") {
          mlDetection.url.phishing++;
        }

        if (scan.prediction === "legitimate") {
          mlDetection.url.legitimate++;
        }
      }

      if (scan.type === "MESSAGE") {
        mlDetection.message.total++;

        if (scan.prediction === "spam") {
          mlDetection.message.spam++;
        }

        if (scan.prediction === "ham") {
          mlDetection.message.ham++;
        }
      }
    });

    // ==========================================
    // ML CONFIDENCE
    // ==========================================

    const mlScans = scans.filter(
      (scan) =>
        typeof scan.confidence === "number"
    );

    const averageMLConfidence =
      mlScans.length > 0
        ? Math.round(
            mlScans.reduce(
              (sum, scan) =>
                sum + scan.confidence,
              0
            ) / mlScans.length
          )
        : 0;

    // ==========================================
    // DETECTION ACTIVITY - LAST 7 DAYS
    // ==========================================

    const dailyActivity = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const nextDate = new Date(date);
      nextDate.setDate(
        nextDate.getDate() + 1
      );

      const dayScans = scans.filter(
        (scan) => {
          const scanDate = new Date(
            scan.createdAt
          );

          return (
            scanDate >= date &&
            scanDate < nextDate
          );
        }
      );

      const safe = dayScans.filter(
        (scan) => scan.score < 30
      ).length;

      const suspicious = dayScans.filter(
        (scan) =>
          scan.score >= 30 &&
          scan.score < 60
      ).length;

      const threats = dayScans.filter(
        (scan) => scan.score >= 60
      ).length;

      dailyActivity.push({
        date: date
          .toISOString()
          .split("T")[0],

        safe,
        suspicious,
        threats,
        total: dayScans.length,
      });
    }

    // ==========================================
    // RISK DISTRIBUTION
    // ==========================================

    const riskDistribution = {
      safe: safeScans,
      suspicious: suspiciousScans,
      highRisk: threatsDetected,
    };

    // ==========================================
    // CATEGORY DISTRIBUTION
    // ==========================================

    const categoryCounts = {
      "Phishing URL": 0,
      "Scam Message": 0,
      "Suspicious URL": 0,
      "Suspicious Message": 0,
      "No Threat": 0,
      "Other Threats": 0,
    };

    scans.forEach((scan) => {
      const category = scan.category;

      if (
        Object.prototype.hasOwnProperty.call(
          categoryCounts,
          category
        )
      ) {
        categoryCounts[category]++;
      } else {
        categoryCounts["Other Threats"]++;
      }
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,

      analytics: {
        // Basic statistics
        totalScans,
        threatsDetected,
        suspiciousScans,
        safeScans,

        // Scan type
        urlScans,
        messageScans,

        // Risk
        averageRisk,
        riskDistribution,

        // Categories
        categoryCounts,

        // ML statistics
        mlPredictions,
        mlDetection,
        averageMLConfidence,

        // Activity
        dailyActivity,

        // Recent scans
        recentScans,
      },
    });
  } catch (error) {
    console.error(
      "Analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch analytics.",
    });
  }
};

module.exports = {
  getAnalytics,
};