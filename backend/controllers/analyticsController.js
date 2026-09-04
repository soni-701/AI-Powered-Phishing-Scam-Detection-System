const Scan = require("../models/Scan");

const getAnalytics = async (req, res) => {
  try {
    const scans = await Scan.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    const recentScans = scans.slice(0, 5);

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

          // -----------------------------
// Detection Activity - Last 7 Days
// -----------------------------

const dailyActivity = [];

for (let i = 6; i >= 0; i--) {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - i);

  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);

  const dayScans = scans.filter((scan) => {
    const scanDate = new Date(scan.createdAt);

    return (
      scanDate >= date &&
      scanDate < nextDate
    );
  });

  const safe = dayScans.filter(
    (scan) => scan.score < 30
  ).length;

  const threats = dayScans.filter(
    (scan) => scan.score >= 60
  ).length;

  dailyActivity.push({
    date: date.toISOString().split("T")[0],
    safe,
    threats,
    total: dayScans.length,
  });
}


    // -----------------------------
    // Risk Distribution
    // -----------------------------

    const riskDistribution = {
      safe: safeScans,
      suspicious: suspiciousScans,
      highRisk: threatsDetected,
    };

    // -----------------------------
    // Category Distribution
    // -----------------------------

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

      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        categoryCounts["Other Threats"]++;
      }
    });

    // -----------------------------
    // Response
    // -----------------------------

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

        recentScans,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch analytics.",
    });
  }
};

module.exports = {
  getAnalytics,
};