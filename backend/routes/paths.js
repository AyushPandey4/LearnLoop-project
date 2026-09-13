"use strict";

const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const { importLimiter } = require("../middleware/rateLimiter");
const { validateImportPath, validateUpdatePath } = require("../validators/pathValidator");
const {
  importPath,
  getAllPaths,
  getContinueLearning,
  getPathById,
  updatePath,
  deletePath,
} = require("../controllers/pathController");

// All paths routes require authentication
router.use(authenticateToken);

router.get("/", getAllPaths);
router.post("/", importLimiter, validateImportPath, importPath);
router.get("/continue", getContinueLearning);
router.get("/:id", getPathById);
router.patch("/:id", validateUpdatePath, updatePath);
router.delete("/:id", deletePath);

module.exports = router;
