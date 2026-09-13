"use strict";

const { body, param } = require("express-validator");
const handleValidation = require("./validate");

const validateImportPath = [
  body("url")
    .notEmpty()
    .withMessage("YouTube playlist URL or ID is required")
    .isString()
    .trim(),
  body("name")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Path name must be 200 characters or less"),
  body("category")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Category name must be 50 characters or less"),
  handleValidation,
];

const validateUpdatePath = [
  param("id").isMongoId().withMessage("Invalid path ID format"),
  body("name")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Path name must be between 1 and 200 characters"),
  body("category")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters"),
  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be 1000 characters or less"),
  handleValidation,
];

module.exports = {
  validateImportPath,
  validateUpdatePath,
};
