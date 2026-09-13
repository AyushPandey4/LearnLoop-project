"use strict";

const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const {
  getCategories,
  createCategory,
  renameCategory,
  deleteCategory,
} = require("../controllers/userController");

// All user routes require authentication
router.use(authenticateToken);

router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:name", renameCategory);
router.delete("/categories/:name", deleteCategory);

module.exports = router;
