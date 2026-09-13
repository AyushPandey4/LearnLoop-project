"use strict";

const { Video } = require("../models");

/**
 * GET /api/search/notes?q=keyword
 * Perform full-text search across all user video notes.
 * Leverages the MongoDB text index on Video.notes: { notes: "text" }
 */
async function searchNotes(req, res) {
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.json({
      success: true,
      data: [],
      message: "Please provide a query parameter 'q'",
    });
  }

  const queryStr = q.trim();

  // Search using $text index for high performance full-text search
  const videos = await Video.find(
    {
      userId: req.user.id,
      $text: { $search: queryStr },
    },
    {
      score: { $meta: "textScore" }, // Text relevance score
    }
  )
    .populate("learningPathId", "name category thumbnail")
    .sort({ score: { $meta: "textScore" } })
    .limit(50)
    .lean();

  res.json({
    success: true,
    data: videos,
    query: queryStr,
    count: videos.length,
  });
}

module.exports = {
  searchNotes,
};
