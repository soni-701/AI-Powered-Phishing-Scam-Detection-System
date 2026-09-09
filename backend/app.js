const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const urlRoutes = require("./routes/urlRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reportRoutes = require("./routes/reportRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// =========================================
// CORS
// =========================================

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman or server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      const isLocalhost =
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);

      if (isLocalhost) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS origin not allowed.")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// =========================================
// SECURITY
// =========================================

app.use(helmet());

// =========================================
// REQUEST BODY
// =========================================

app.use(
  express.json({
    limit: "100kb",
  })
);

// =========================================
// ROOT
// =========================================

app.get("/", (req, res) => {
  res.json({
    message: "AI Phishing & Scam Detection API",
    status: "running",
  });
});

// =========================================
// HEALTH CHECK
// =========================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is working correctly",
  });
});

// =========================================
// API ROUTES
// =========================================

app.use("/api/scan/url", urlRoutes);

app.use("/api/scan/message", messageRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

// =========================================
// 404 - ROUTE NOT FOUND
// =========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =========================================
// GLOBAL ERROR HANDLER
// =========================================

app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  // CORS error
  if (err.message === "CORS origin not allowed.") {
    return res.status(403).json({
      success: false,
      message: "Request origin is not allowed.",
    });
  }

  // Request body too large
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message:
        "Request body is too large. Please reduce the request size.",
    });
  }

  // Invalid JSON
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request.",
    });
  }

  // Generic safe error
  res.status(err.status || 500).json({
    success: false,
    message:
      err.status && err.status < 500
        ? err.message
        : "Internal server error.",
  });
});

// =========================================
// EXPORT EXPRESS APP
// =========================================

module.exports = app;