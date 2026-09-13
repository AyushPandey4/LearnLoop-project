"use strict";

const mongoose = require("mongoose");

/**
 * Video Schema
 *
 * Represents a single YouTube video inside a LearningPath.
 * Each video belongs to one LearningPath and one User.
 */
const videoSchema = new mongoose.Schema(
  {
    learningPathId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningPath",
      required: true,
    },
    // Storing userId directly avoids a join for ownership checks.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // YouTube video ID (e.g. "dQw4w9WgXcQ")
    ytId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    // ISO 8601 duration string from YouTube (e.g. "PT12M34S")
    // Stored as string — we parse it on the frontend for display.
    duration: {
      type: String,
      default: "",
    },
    channelTitle: {
      type: String,
      default: "",
    },
    // Position within the playlist (from YouTube's API).
    // Determines the display order. Not user-editable.
    position: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["to-watch", "in-progress", "completed"],
      default: "to-watch",
    },
    notes: {
      type: String,
      default: "",
    },
    // Set when status changes to "completed". Null otherwise.
    // Enables streak/cadence queries: completed videos per day/week.
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ────────────────────────────────────────────────────────────────

// Primary query pattern: "fetch all videos for this learning path, ordered by position"
// This compound index covers both the filter and the sort in one index scan.
videoSchema.index({ learningPathId: 1, position: 1 });

// Authorization check: "does this user own this video?"
// Single-query ownership: Video.findOne({ _id: videoId, userId: req.user.id })
videoSchema.index({ userId: 1 });

// "Continue Learning" query: find the first unwatched video across all user's paths.
// Filter: { userId, status: "to-watch" } — this compound index makes it efficient.
videoSchema.index({ userId: 1, status: 1 });

// Full-text search on notes. Enables $text queries:
// db.videos.find({ $text: { $search: "react hooks" } })
videoSchema.index({ notes: "text" });

module.exports = mongoose.model("Video", videoSchema);
