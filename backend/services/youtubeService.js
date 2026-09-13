"use strict";

const { google } = require("googleapis");
const { getCache, setCache, CacheKeys } = require("../config/cache");

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

/**
 * Extract playlist ID from various YouTube playlist URL formats
 * e.g.,
 * - https://www.youtube.com/playlist?list=PL4cUxeGkcC9i9Ae2D9EeHackyG4LcqCWu
 * - https://youtube.com/playlist?list=PL4cUxeGkcC9i9Ae2D9EeHackyG4LcqCWu
 * - PL4cUxeGkcC9i9Ae2D9EeHackyG4LcqCWu
 */
function extractPlaylistId(urlOrId) {
  if (!urlOrId) return null;
  const str = urlOrId.trim();

  // If it's already just an ID (alphanumeric, dashes, underscores, usually starting with PL)
  if (/^[A-Za-z0-9_-]+$/.test(str) && !str.includes("http")) {
    return str;
  }

  try {
    const parsed = new URL(str);
    const listParam = parsed.searchParams.get("list");
    if (listParam) return listParam;
  } catch (err) {
    // Not a valid URL
  }

  return null;
}

/**
 * Fetch raw metadata and items for a YouTube playlist.
 * Uses 24h Redis caching to avoid wasting API quota.
 */
async function fetchYouTubePlaylist(playlistId) {
  const cacheKey = CacheKeys.ytPlaylist(playlistId);
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  if (!process.env.YOUTUBE_API_KEY) {
    const error = new Error("YOUTUBE_API_KEY is not configured on the server");
    error.statusCode = 500;
    error.code = "MISSING_YOUTUBE_KEY";
    throw error;
  }

  // 1. Fetch playlist snippet metadata
  let playlistRes;
  try {
    playlistRes = await youtube.playlists.list({
      part: ["snippet"],
      id: [playlistId],
    });
  } catch (err) {
    const error = new Error(`YouTube API request failed: ${err.message}`);
    error.statusCode = 502;
    error.code = "YOUTUBE_API_ERROR";
    throw error;
  }

  if (!playlistRes.data.items || playlistRes.data.items.length === 0) {
    const error = new Error("YouTube playlist not found or is private");
    error.statusCode = 404;
    error.code = "PLAYLIST_NOT_FOUND";
    throw error;
  }

  const playlistSnippet = playlistRes.data.items[0].snippet;

  // 2. Fetch all playlist items (paginated)
  let playlistItems = [];
  let nextPageToken = null;

  do {
    const itemsRes = await youtube.playlistItems.list({
      part: ["snippet", "contentDetails"],
      playlistId: playlistId,
      maxResults: 50,
      pageToken: nextPageToken || undefined,
    });

    if (itemsRes.data.items) {
      playlistItems.push(...itemsRes.data.items);
    }

    nextPageToken = itemsRes.data.nextPageToken;
  } while (nextPageToken);

  // Filter out deleted/private videos that don't have valid video IDs
  const validItems = playlistItems.filter(
    (item) => item.contentDetails && item.contentDetails.videoId
  );

  // 3. Batch fetch video details (durations) in chunks of 50
  const videoDetailsMap = new Map();
  const rawVideoIds = validItems.map((item) => item.contentDetails.videoId);

  for (let i = 0; i < rawVideoIds.length; i += 50) {
    const chunk = rawVideoIds.slice(i, i + 50);
    const videosRes = await youtube.videos.list({
      part: ["snippet", "contentDetails"],
      id: chunk,
    });

    if (videosRes.data.items) {
      for (const vid of videosRes.data.items) {
        videoDetailsMap.set(vid.id, vid);
      }
    }
  }

  // Format clean playlist object
  const formattedVideos = validItems.map((item, idx) => {
    const videoId = item.contentDetails.videoId;
    const details = videoDetailsMap.get(videoId);

    const title = details?.snippet?.title || item.snippet?.title || "Untitled Video";
    const description = details?.snippet?.description || item.snippet?.description || "";
    const thumbnail =
      details?.snippet?.thumbnails?.high?.url ||
      details?.snippet?.thumbnails?.default?.url ||
      item.snippet?.thumbnails?.high?.url ||
      item.snippet?.thumbnails?.default?.url ||
      "";
    const duration = details?.contentDetails?.duration || "";
    const channelTitle = details?.snippet?.channelTitle || item.snippet?.channelTitle || "";

    return {
      ytId: videoId,
      title,
      description,
      thumbnail,
      duration,
      channelTitle,
      position: idx,
    };
  });

  const result = {
    ytPlaylistId: playlistId,
    title: playlistSnippet.title || "Untitled Learning Path",
    description: playlistSnippet.description || "",
    thumbnail:
      playlistSnippet.thumbnails?.high?.url ||
      playlistSnippet.thumbnails?.default?.url ||
      "",
    channelTitle: playlistSnippet.channelTitle || "",
    videos: formattedVideos,
  };

  // Cache raw fetched YouTube playlist for 24 hours (86400s)
  await setCache(cacheKey, result, 86400);

  return result;
}

module.exports = {
  extractPlaylistId,
  fetchYouTubePlaylist,
};
