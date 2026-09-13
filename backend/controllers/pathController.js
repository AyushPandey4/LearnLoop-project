"use strict";

const { LearningPath, Video } = require("../models");
const { extractPlaylistId, fetchYouTubePlaylist } = require("../services/youtubeService");
const { getCache, setCache, deleteCache, CacheKeys } = require("../config/cache");

/**
 * POST /api/paths
 * Import a YouTube playlist as a new LearningPath.
 */
async function importPath(req, res) {
  const { url, name, category } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: "YouTube playlist URL or ID is required",
      code: "MISSING_URL",
    });
  }

  const ytPlaylistId = extractPlaylistId(url);
  if (!ytPlaylistId) {
    return res.status(400).json({
      success: false,
      message: "Invalid YouTube playlist URL or ID format",
      code: "INVALID_URL",
    });
  }

  // Check if user already imported this playlist
  const existing = await LearningPath.findOne({
    userId: req.user.id,
    ytPlaylistId: ytPlaylistId,
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "You have already imported this YouTube playlist",
      code: "DUPLICATE_PATH",
    });
  }

  // Fetch playlist data from YouTube API (or 24h Redis cache)
  const ytData = await fetchYouTubePlaylist(ytPlaylistId);

  const catName = category && category.trim() ? category.trim() : "All";

  // Create LearningPath document
  const learningPath = await LearningPath.create({
    userId: req.user.id,
    name: name && name.trim() ? name.trim() : ytData.title,
    description: ytData.description,
    category: catName,
    ytPlaylistId: ytPlaylistId,
    ytPlaylistUrl: `https://www.youtube.com/playlist?list=${ytPlaylistId}`,
    thumbnail: ytData.thumbnail,
    channelTitle: ytData.channelTitle,
    totalVideos: ytData.videos.length,
  });

  // Create Video documents in bulk
  if (ytData.videos.length > 0) {
    const videoDocs = ytData.videos.map((v) => ({
      learningPathId: learningPath._id,
      userId: req.user.id,
      ytId: v.ytId,
      title: v.title,
      description: v.description,
      thumbnail: v.thumbnail,
      duration: v.duration,
      channelTitle: v.channelTitle,
      position: v.position,
      status: "to-watch",
    }));

    await Video.insertMany(videoDocs);
  }

  // Invalidate dashboard cache for this user
  await deleteCache(CacheKeys.dashboard(req.user.id));

  res.status(201).json({
    success: true,
    message: "Learning path imported successfully",
    data: learningPath,
  });
}

/**
 * GET /api/paths
 * Get all LearningPaths for the logged-in user with computed progress statistics.
 */
async function getAllPaths(req, res) {
  const cacheKey = CacheKeys.dashboard(req.user.id);
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({ success: true, data: cached });
  }

  // 1. Fetch user's paths sorted by newest first
  const paths = await LearningPath.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .lean();

  if (paths.length === 0) {
    const emptyResult = { paths: [], overallStats: { totalPaths: 0, completedPaths: 0, totalVideos: 0, completedVideos: 0 } };
    await setCache(cacheKey, emptyResult, 3600);
    return res.json({ success: true, data: emptyResult });
  }

  const pathIds = paths.map((p) => p._id);

  // 2. Fetch completed video counts per path using MongoDB Aggregation
  const completedStats = await Video.aggregate([
    {
      $match: {
        learningPathId: { $in: pathIds },
        status: "completed",
      },
    },
    {
      $group: {
        _id: "$learningPathId",
        completedCount: { $sum: 1 },
      },
    },
  ]);

  const completedMap = new Map();
  completedStats.forEach((stat) => {
    completedMap.set(stat._id.toString(), stat.completedCount);
  });

  // 3. Attach progress metrics to each path
  let overallTotalVideos = 0;
  let overallCompletedVideos = 0;
  let completedPathsCount = 0;

  const formattedPaths = paths.map((path) => {
    const pathIdStr = path._id.toString();
    const completedVideos = completedMap.get(pathIdStr) || 0;
    const totalVideos = path.totalVideos || 0;
    const progressPercent = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
    const isCompleted = totalVideos > 0 && completedVideos === totalVideos;

    if (isCompleted) completedPathsCount++;
    overallTotalVideos += totalVideos;
    overallCompletedVideos += completedVideos;

    return {
      ...path,
      completedVideos,
      progressPercent,
      isCompleted,
    };
  });

  const result = {
    paths: formattedPaths,
    overallStats: {
      totalPaths: paths.length,
      completedPaths: completedPathsCount,
      totalVideos: overallTotalVideos,
      completedVideos: overallCompletedVideos,
      overallProgressPercent: overallTotalVideos > 0 ? Math.round((overallCompletedVideos / overallTotalVideos) * 100) : 0,
    },
  };

  // Cache dashboard result for 1 hour (3600s)
  await setCache(cacheKey, result, 3600);

  res.json({ success: true, data: result });
}

/**
 * GET /api/paths/continue
 * Returns the next video the user should watch ("Continue Learning" feature).
 * Finds the most recently updated active path and its first "to-watch" or "in-progress" video.
 */
async function getContinueLearning(req, res) {
  // Find the first non-completed video for this user
  // Prioritize status 'in-progress', then 'to-watch', ordered by position
  let nextVideo = await Video.findOne({
    userId: req.user.id,
    status: "in-progress",
  })
    .populate("learningPathId", "name category thumbnail")
    .sort({ updatedAt: -1 })
    .lean();

  if (!nextVideo) {
    nextVideo = await Video.findOne({
      userId: req.user.id,
      status: "to-watch",
    })
      .populate("learningPathId", "name category thumbnail")
      .sort({ position: 1 })
      .lean();
  }

  if (!nextVideo) {
    return res.json({
      success: true,
      data: null,
      message: "No videos to watch. Either import a new path or you've completed all videos!",
    });
  }

  res.json({
    success: true,
    data: {
      video: nextVideo,
      learningPath: nextVideo.learningPathId,
    },
  });
}

/**
 * GET /api/paths/:id
 * Get single LearningPath details along with its ordered list of videos.
 */
async function getPathById(req, res) {
  const pathId = req.params.id;
  const cacheKey = CacheKeys.path(pathId);

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({ success: true, data: cached });
  }

  const learningPath = await LearningPath.findOne({
    _id: pathId,
    userId: req.user.id,
  }).lean();

  if (!learningPath) {
    return res.status(404).json({
      success: false,
      message: "Learning path not found",
      code: "PATH_NOT_FOUND",
    });
  }

  const videos = await Video.find({ learningPathId: pathId })
    .sort({ position: 1 })
    .lean();

  const completedVideos = videos.filter((v) => v.status === "completed").length;
  const progressPercent = videos.length > 0 ? Math.round((completedVideos / videos.length) * 100) : 0;

  const result = {
    ...learningPath,
    completedVideos,
    progressPercent,
    videos,
  };

  await setCache(cacheKey, result, 3600); // 1h cache

  res.json({
    success: true,
    data: result,
  });
}

/**
 * PATCH /api/paths/:id
 * Update metadata (name, category, description) for a LearningPath.
 */
async function updatePath(req, res) {
  const pathId = req.params.id;
  const { name, category, description } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name.trim();
  if (category !== undefined) updates.category = category.trim();
  if (description !== undefined) updates.description = description.trim();

  const updatedPath = await LearningPath.findOneAndUpdate(
    { _id: pathId, userId: req.user.id },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!updatedPath) {
    return res.status(404).json({
      success: false,
      message: "Learning path not found or access denied",
      code: "PATH_NOT_FOUND",
    });
  }

  await deleteCache([CacheKeys.dashboard(req.user.id), CacheKeys.path(pathId)]);

  res.json({
    success: true,
    message: "Learning path updated successfully",
    data: updatedPath,
  });
}

/**
 * DELETE /api/paths/:id
 * Delete a LearningPath and all its associated Videos.
 */
async function deletePath(req, res) {
  const pathId = req.params.id;

  const deletedPath = await LearningPath.findOneAndDelete({
    _id: pathId,
    userId: req.user.id,
  });

  if (!deletedPath) {
    return res.status(404).json({
      success: false,
      message: "Learning path not found or access denied",
      code: "PATH_NOT_FOUND",
    });
  }

  // Delete all associated videos
  await Video.deleteMany({ learningPathId: pathId });

  // Invalidate cache
  await deleteCache([CacheKeys.dashboard(req.user.id), CacheKeys.path(pathId)]);

  res.json({
    success: true,
    message: "Learning path deleted successfully",
  });
}

module.exports = {
  importPath,
  getAllPaths,
  getContinueLearning,
  getPathById,
  updatePath,
  deletePath,
};
