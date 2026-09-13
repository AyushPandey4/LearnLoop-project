"use strict";

const { body, param } = require("express-validator");
const handleValidation = require("./validate");

const validateVideoId = [
  param("id").isMongoId().withMessage("Invalid video ID format"),
  handleValidation,
];

const validateUpdateVideoStatus = [
  param("id").isMongoId().withMessage("Invalid video ID format"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["to-watch", "in-progress", "completed"])
    .withMessage("Status must be one of: 'to-watch', 'in-progress', 'completed'"),
  handleValidation,
];

const validateUpdateVideoNotes = [
  param("id").isMongoId().withMessage("Invalid video ID format"),
  body("notes")
    .exists()
    .withMessage("Notes field is required")
    .isString()
    .withMessage("Notes must be a string")
    .isLength({ max: 50000 })
    .withMessage("Notes exceed maximum allowed limit (50,000 characters)"),
  handleValidation,
];

module.exports = {
  validateVideoId,
  validateUpdateVideoStatus,
  validateUpdateVideoNotes,
};
