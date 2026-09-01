const Scan = require("../models/Scan");

const getAnalytics = async (req, res) => {
  try {
    const scans = await Scan.find().sort({
      createdAt: -1,
    });

    const totalScans = scans.length;

    const threatsDetected = scans.filter(
      (scan) => scan.score >= 60
    ).length;

    const suspiciousScans = scans.filter(
      (scan) =>
        scan.score >= 30 && scan.score < 60
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

    const riskDistribution = {
      safe: safeScans,
      suspicious: suspiciousScans,
      highRisk: threatsDetected,
    };

    const categoryCounts = {};

    scans.forEach((scan) => {
      const category =
        scan.category || "Other Threats";

      categoryCounts[category] =
        (categoryCounts[category] || 0) + 1;
    });

    res.status(200).json({
      success: true,

      analytics: {
        totalScans,
        threatsDetected,
        suspiciousScans,
        safeScans,
        urlScans,
        messageScans,
        averageRisk,
        riskDistribution,
        categoryCounts,
      },
    });
  } catch (error) {
    console.error(
      "Analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch analytics.",
    });
  }
};

module.exports = {
  getAnalytics,
};