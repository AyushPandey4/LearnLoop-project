"use strict";

const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const {
  validateVideoId,
  validateUpdateVideoStatus,
  validateUpdateVideoNotes,
} = require("../validators/videoValidator");
const {
  getVideoById,
  updateVideoStatus,
  updateVideoNotes,
} = require("../controllers/videoController");

// All video routes require authentication
router.use(authenticateToken);

router.get("/:id", validateVideoId, getVideoById);
router.patch("/:id/status", validateUpdateVideoStatus, updateVideoStatus);
router.patch("/:id/notes", validateUpdateVideoNotes, updateVideoNotes);

module.exports = router;
