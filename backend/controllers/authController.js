"use strict";

const jwt = require("jsonwebtoken");
const { getGoogleAuthUrl, exchangeCodeForUser } = require("../services/googleAuthService");
const { User } = require("../models");
const { setCache, deleteCache, CacheKeys } = require("../config/cache");

// JWT expires in 7 days. Long enough to avoid constant re-logins,
// short enough to limit the window if a token is ever compromised.
const JWT_EXPIRY = "7d";

// Cookie max age in milliseconds — must match JWT_EXPIRY
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

/**
 * Cookie options for the JWT.
 *
 * httpOnly: true  — JavaScript cannot read this cookie (XSS protection).
 * secure: true in production — cookie only sent over HTTPS.
 * sameSite: "lax" — sent on same-site requests AND top-level cross-site navigations
 *   (GET redirects). We need "lax" (not "strict") because the Google OAuth callback
 *   is a cross-site redirect (from accounts.google.com) that needs to reach our backend.
 */
function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
  };
}

/**
 * GET /api/auth/google
 * Redirects the user to Google's OAuth consent page.
 * The user will see Google's "Sign in with Google" screen.
 */
function redirectToGoogle(req, res) {
  const url = getGoogleAuthUrl();
  res.redirect(url);
}

/**
 * GET /api/auth/google/callback
 * Handles the redirect from Google after user approves.
 *
 * Google sends: ?code=<one-time-code>&state=...
 * We exchange the code for a verified user identity, then issue our own JWT.
 */
async function handleGoogleCallback(req, res) {
  const { code, error } = req.query;

  // If user denied the OAuth consent
  if (error || !code) {
    const reason = error || "no_code";
    return res.redirect(
      `${process.env.FRONTEND_URL}/?error=${encodeURIComponent(reason)}`
    );
  }

  // Exchange code for verified user identity (server-to-server, never browser-visible)
  const identity = await exchangeCodeForUser(code);

  // Find existing user or create a new one
  let user = await User.findOne({ googleId: identity.googleId });

  if (!user) {
    // New user — create their account
    user = await User.create({
      googleId: identity.googleId,
      email: identity.email,
      name: identity.name,
      avatar: identity.avatar,
    });
    console.log(`[auth] New user created: ${identity.email}`);
  } else {
    // Returning user — update name/avatar in case they changed on Google
    user.name = identity.name;
    user.avatar = identity.avatar;
    await user.save();
  }

  // Issue our own JWT — payload contains only the MongoDB user ID.
  // We don't embed name/email/etc in the token. We always fetch fresh
  // user data from the database (or cache) when needed.
  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  // Cache the user profile to speed up GET /api/auth/me
  await setCache(CacheKeys.user(user._id.toString()), {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    categories: user.categories,
    createdAt: user.createdAt,
  }, 86400); // 24 hours

  // Set JWT as httpOnly cookie — browser will send this automatically on all requests
  res.cookie("token", token, getCookieOptions());

  // Redirect browser to the frontend dashboard
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
}

/**
 * GET /api/auth/me
 * Returns the current user's profile.
 * Called by the frontend on every page load to verify the session is active.
 * Protected by authenticateToken middleware.
 */
async function getMe(req, res) {
  // Try cache first
  const cached = await (require("../config/cache").getCache)(
    CacheKeys.user(req.user.id)
  );

  if (cached) {
    return res.json({ success: true, data: cached });
  }

  // Cache miss — fetch from DB
  const user = await User.findById(req.user.id).select("-__v");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      code: "USER_NOT_FOUND",
    });
  }

  // Re-cache
  await setCache(CacheKeys.user(req.user.id), user, 86400);

  res.json({ success: true, data: user });
}

/**
 * POST /api/auth/logout
 * Clears the JWT cookie. The user is now logged out.
 * Protected by authenticateToken middleware.
 */
async function logout(req, res) {
  // Invalidate the user cache on logout
  await deleteCache(CacheKeys.user(req.user.id));

  // Clear the cookie
  res.clearCookie("token", getCookieOptions());

  res.json({ success: true, message: "Logged out successfully" });
}

module.exports = { redirectToGoogle, handleGoogleCallback, getMe, logout };
