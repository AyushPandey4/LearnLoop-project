"use strict";

const mongoose = require("mongoose");

/**
 * LearningPath Schema
 *
 * Represents a YouTube playlist imported by a user as a structured learning path.
 * One user owns many learning paths (userId is the ownership field).
 */
const learningPathSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "All",
    },
    // YouTube playlist identifiers
    ytPlaylistId: {
      type: String,
      default: "",
    },
    ytPlaylistUrl: {
      type: String,
      default: "",
    },
    // Metadata fetched from YouTube at import time
    thumbnail: {
      type: String,
      default: "",
    },
    channelTitle: {
      type: String,
      default: "",
    },
    // Total video count from YouTube. Stored so we can show it
    // without counting Video documents on every request.
    totalVideos: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ────────────────────────────────────────────────────────────────
// userId: The most critical index — all dashboard queries filter by userId.
// Without this, every GET /api/paths does a full collection scan.
learningPathSchema.index({ userId: 1 });

// Compound index: userId + createdAt — enables sorting by newest first
// efficiently while already filtering by user.
learningPathSchema.index({ userId: 1, createdAt: -1 });

// Deduplication: prevent the same YouTube playlist from being imported twice
// by the same user. Sparse: true means documents without ytPlaylistId are excluded.
learningPathSchema.index(
  { userId: 1, ytPlaylistId: 1 },
  { unique: true, sparse: true }
);

module.exports = mongoose.model("LearningPath", learningPathSchema);
