"use strict";

const rateLimit = require("express-rate-limit");

/**
 * Global API rate limiter:
 * 1,000 requests per 15 minutes per IP (~66 req/min).
 * Generous for normal browsing and search while protecting against abuse.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 1000,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
    code: "RATE_LIMIT_EXCEEDED",
  },
});

/**
 * Rate Limiter for Auth endpoints (Login / Callback):
 * 30 attempts per 15 minutes.
 * Generous headroom for accidental retries while mitigating brute-force attacks.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
});

/**
 * Rate Limiter for YouTube Playlist Ingestion:
 * 15 playlist imports per 15 minutes.
 * Allows importing multiple courses in one sitting while protecting YouTube API quota.
 */
const importLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Playlist import limit reached. Please wait a few minutes before importing more playlists.",
    code: "IMPORT_RATE_LIMIT_EXCEEDED",
  },
});

module.exports = {
  globalLimiter,
  authLimiter,
  importLimiter,
};
