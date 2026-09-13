"use strict";

/**
 * Global error handler middleware.
 * Must be the LAST middleware registered in server.js (after all routes).
 *
 * Catches errors thrown from route handlers via next(err) or async handler wrappers.
 * Returns a consistent { success, message, code } response structure.
 */
function errorHandler(err, req, res, next) { 
  // Log the full error for debugging (server-side only)
  console.error(`[error] ${req.method} ${req.url} →`, err.message);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(". "),
      code: "VALIDATION_ERROR",
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
      code: "DUPLICATE_ERROR",
    });
  }

  // Handle JWT errors (these should normally be caught in middleware/auth.js,
  // but this is a safety net)
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      code: "INVALID_TOKEN",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Session expired — please log in again",
      code: "TOKEN_EXPIRED",
    });
  }

  // Generic fallback — avoid leaking internal error details in production
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "An unexpected error occurred"
      : err.message || "An unexpected error occurred";

  res.status(statusCode).json({
    success: false,
    message,
    code: err.code || "SERVER_ERROR",
  });
}

module.exports = errorHandler;
