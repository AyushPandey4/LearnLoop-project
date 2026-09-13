"use strict";

const jwt = require("jsonwebtoken");

/**
 * JWT authentication middleware.
 * Reads the JWT from the 'token' httpOnly cookie (set by the auth flow).
 * Sets req.user = { id: "<MongoDB ObjectId>" } on success.
 *
 * Returns 401 if no token is present.
 * Returns 401 if the token is expired or invalid.
 */
function authenticateToken(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required — please log in",
      code: "NO_TOKEN",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired — please log in again",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token — please log in again",
      code: "INVALID_TOKEN",
    });
  }
}

module.exports = { authenticateToken };
