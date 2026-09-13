"use strict";

/**
 * Central model export.
 * Import from here to avoid spelling model filenames across the codebase:
 *   const { User, LearningPath, Video } = require("../models");
 */
const User = require("./User");
const LearningPath = require("./LearningPath");
const Video = require("./Video");

module.exports = { User, LearningPath, Video };
