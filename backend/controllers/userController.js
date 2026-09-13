"use strict";

const { User, LearningPath } = require("../models");
const { getCache, setCache, deleteCache, CacheKeys } = require("../config/cache");

/**
 * GET /api/user/categories
 * Get all category names for the logged-in user.
 */
async function getCategories(req, res) {
  const cacheKey = `categories:${req.user.id}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({ success: true, data: cached });
  }

  const user = await User.findById(req.user.id).select("categories").lean();
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      code: "USER_NOT_FOUND",
    });
  }

  const categories = user.categories && user.categories.length > 0 ? user.categories : ["All"];
  await setCache(cacheKey, categories, 86400); // 24h

  res.json({ success: true, data: categories });
}

/**
 * POST /api/user/categories
 * Add a new category string to the user's category list.
 */
async function createCategory(req, res) {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Category name is required",
      code: "MISSING_NAME",
    });
  }

  const trimmed = name.trim();

  if (trimmed.toLowerCase() === "all") {
    return res.status(409).json({
      success: false,
      message: "Category 'All' is already the default category",
      code: "DUPLICATE_CATEGORY",
    });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      code: "USER_NOT_FOUND",
    });
  }

  if (user.categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
    return res.status(409).json({
      success: false,
      message: "Category already exists",
      code: "DUPLICATE_CATEGORY",
    });
  }

  user.categories.push(trimmed);
  await user.save();

  await deleteCache([`categories:${req.user.id}`, CacheKeys.user(req.user.id)]);

  res.status(201).json({
    success: true,
    message: "Category added successfully",
    data: user.categories,
  });
}

/**
 * PUT /api/user/categories/:name
 * Rename a category. Also updates all LearningPaths belonging to the user with the old category name.
 */
async function renameCategory(req, res) {
  const oldName = decodeURIComponent(req.params.name).trim();
  const { newName } = req.body;

  if (!newName || !newName.trim()) {
    return res.status(400).json({
      success: false,
      message: "New category name is required",
      code: "MISSING_NAME",
    });
  }

  const trimmedNew = newName.trim();

  if (oldName === "All") {
    return res.status(400).json({
      success: false,
      message: "Cannot rename the default 'All' category",
      code: "CANNOT_RENAME_DEFAULT",
    });
  }

  if (trimmedNew.toLowerCase() === "all") {
    return res.status(400).json({
      success: false,
      message: "Cannot rename a category to 'All'",
      code: "RENAME_TO_DEFAULT",
    });
  }

  if (oldName.toLowerCase() === trimmedNew.toLowerCase()) {
    return res.status(400).json({
      success: false,
      message: "New name must be different from current name",
      code: "SAME_NAME",
    });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      code: "USER_NOT_FOUND",
    });
  }

  const index = user.categories.indexOf(oldName);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
      code: "CATEGORY_NOT_FOUND",
    });
  }

  // Replace category name in array
  user.categories[index] = trimmedNew;
  await user.save();

  // Cascade update to all user's LearningPaths with this category
  await LearningPath.updateMany(
    { userId: req.user.id, category: oldName },
    { $set: { category: trimmedNew } }
  );

  await deleteCache([
    `categories:${req.user.id}`,
    CacheKeys.user(req.user.id),
    CacheKeys.dashboard(req.user.id),
  ]);

  res.json({
    success: true,
    message: "Category renamed successfully",
    data: user.categories,
  });
}

/**
 * DELETE /api/user/categories/:name
 * Delete a category. Reassigns any LearningPaths with this category to "All".
 */
async function deleteCategory(req, res) {
  const categoryName = decodeURIComponent(req.params.name).trim();

  if (categoryName === "All") {
    return res.status(400).json({
      success: false,
      message: "Cannot delete the default 'All' category",
      code: "CANNOT_DELETE_DEFAULT",
    });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      code: "USER_NOT_FOUND",
    });
  }

  const index = user.categories.indexOf(categoryName);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
      code: "CATEGORY_NOT_FOUND",
    });
  }

  // Remove from array
  user.categories.splice(index, 1);
  await user.save();

  // Reassign paths with this category to "All"
  await LearningPath.updateMany(
    { userId: req.user.id, category: categoryName },
    { $set: { category: "All" } }
  );

  await deleteCache([
    `categories:${req.user.id}`,
    CacheKeys.user(req.user.id),
    CacheKeys.dashboard(req.user.id),
  ]);

  res.json({
    success: true,
    message: "Category deleted and paths reassigned to 'All'",
    data: user.categories,
  });
}

module.exports = {
  getCategories,
  createCategory,
  renameCategory,
  deleteCategory,
};
