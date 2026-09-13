"use strict";

const router = require("express").Router();
const { redirectToGoogle, handleGoogleCallback, getMe, logout } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

/**
 * Auth Routes
 * Rate limited to 30 login requests per 15 mins to prevent OAuth brute force attacks.
 */

// No auth required — entry points
router.get("/google", authLimiter, redirectToGoogle);
router.get("/google/callback", authLimiter, handleGoogleCallback);

// Auth required
router.get("/me", authenticateToken, getMe);
router.post("/logout", authenticateToken, logout);

module.exports = router;
