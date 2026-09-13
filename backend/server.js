"use strict";

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const errorHandler = require("./middleware/errorHandler");

const { globalLimiter } = require("./middleware/rateLimiter");

// Load environment variables before anything else
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy if behind a reverse proxy (e.g. Render / Heroku / Nginx)
// so rate limiters can read the user's real IP address through the reverse proxy
app.set("trust proxy", 1);

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Required for httpOnly cookies to be sent cross-origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body & Cookie Parsing ───────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // Limit request body size
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Apply global rate limiting to all API endpoints
app.use("/api/", globalLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/paths", require("./routes/paths"));
app.use("/api/videos", require("./routes/videos"));
app.use("/api/search", require("./routes/search"));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "LearnLoop API is running" });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found", code: "NOT_FOUND" });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
async function start() {
  await connectDB();   // MongoDB — exits process on failure
  await connectRedis(); // Redis  — logs warning and continues on failure

  app.listen(PORT, () => {
    console.log(`[server] LearnLoop API running on port ${PORT}`);
    console.log(`[server] Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

start();
