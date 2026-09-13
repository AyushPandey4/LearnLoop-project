"use strict";

const { validationResult } = require("express-validator");

/**
 * Middleware wrapper to validate express-validator rules.
 * If validation errors exist, returns a formatted 400 response.
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return res.status(400).json({
      success: false,
      message: errorMessages.join(". "),
      code: "VALIDATION_ERROR",
      errors: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
    });
  }

  next();
}

module.exports = handleValidation;
