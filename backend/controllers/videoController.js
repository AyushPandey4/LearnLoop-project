"use strict";

const { Video } = require("../models");
const { getCache, setCache, deleteCache, CacheKeys } = require("../config/cache");

/**
 * GET /api/videos/:id
 * Get single video detail. Protected by single-query userId ownership check.
 */
async function getVideoById(req, res) {
  const videoId = req.params.id;
  const cacheKey = CacheKeys.video(videoId);

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({ success: true, data: cached });
  }

  const video = await Video.findOne({
    _id: videoId,
    userId: req.user.id,
  })
    .populate("learningPathId", "name category")
    .lean();

  if (!video) {
    return res.status(404).json({
      success: false,
      message: "Video not found or access denied",
      code: "VIDEO_NOT_FOUND",
    });
  }

  await setCache(cacheKey, video, 3600); // 1h cache

  res.json({
    success: true,
    data: video,
  });
}

/**
 * PATCH /api/videos/:id/status
 * Update watch status for a video ('to-watch' | 'in-progress' | 'completed').
 */
async function updateVideoStatus(req, res) {
  const { status } = req.body;
  const validStatuses = ["to-watch", "in-progress", "completed"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be one of: 'to-watch', 'in-progress', 'completed'",
      code: "INVALID_STATUS",
    });
  }

  const updateFields = { status };
  if (status === "completed") {
    updateFields.completedAt = new Date();
  } else {
    updateFields.completedAt = null;
  }

  const updatedVideo = await Video.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!updatedVideo) {
    return res.status(404).json({
      success: false,
      message: "Video not found or access denied",
      code: "VIDEO_NOT_FOUND",
    });
  }

  // Invalidate dashboard and path cache
  await deleteCache([
    CacheKeys.dashboard(req.user.id),
    CacheKeys.path(updatedVideo.learningPathId.toString()),
    CacheKeys.video(updatedVideo._id.toString()),
  ]);

  res.json({
    success: true,
    message: "Video status updated successfully",
    data: updatedVideo,
  });
}

/**
 * PATCH /api/videos/:id/notes
 * Update per-video notes string.
 */
async function updateVideoNotes(req, res) {
  const { notes } = req.body;

  if (notes === undefined) {
    return res.status(400).json({
      success: false,
      message: "Notes field is required",
      code: "MISSING_NOTES",
    });
  }

  const updatedVideo = await Video.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: { notes: String(notes) } },
    { new: true }
  );

  if (!updatedVideo) {
    return res.status(404).json({
      success: false,
      message: "Video not found or access denied",
      code: "VIDEO_NOT_FOUND",
    });
  }

  await deleteCache([CacheKeys.video(updatedVideo._id.toString())]);

  res.json({
    success: true,
    message: "Notes saved successfully",
    data: updatedVideo,
  });
}

module.exports = {
  getVideoById,
  updateVideoStatus,
  updateVideoNotes,
};
