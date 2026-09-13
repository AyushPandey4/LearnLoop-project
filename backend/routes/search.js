"use strict";

const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const { searchNotes } = require("../controllers/searchController");

// All search routes require authentication
router.use(authenticateToken);

router.get("/notes", searchNotes);

module.exports = router;
