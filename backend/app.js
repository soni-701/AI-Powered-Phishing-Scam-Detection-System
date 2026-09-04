const express = require("express");
const cors = require("cors");

const app = express();

const urlRoutes = require("./routes/urlRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reportRoutes = require("./routes/reportRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes=require('./routes/authRoutes')

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Phishing & Scam Detection API",
    status: "running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is working correctly",
  });
});

// URL Scanner API
app.use("/api/scan/url", urlRoutes);
app.use("/api/scan/message", messageRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth",authRoutes);

module.exports = app;