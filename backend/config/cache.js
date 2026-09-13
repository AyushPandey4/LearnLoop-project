"use strict";

const { getClient } = require("./redis");

const DEFAULT_TTL = 3600; // 1 hour in seconds

/**
 * Read a value from Redis cache.
 * Returns null on cache miss or if Redis is unavailable.
 */
async function getCache(key) {
  const client = getClient();
  if (!client) return null;

  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn(`[cache] getCache failed for key "${key}":`, err.message);
    return null;
  }
}

/**
 * Write a value to Redis cache with a TTL (seconds).
 * Silently skips if Redis is unavailable.
 */
async function setCache(key, value, ttl = DEFAULT_TTL) {
  const client = getClient();
  if (!client) return;

  try {
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.warn(`[cache] setCache failed for key "${key}":`, err.message);
  }
}

/**
 * Delete one or more keys from Redis cache.
 * Accepts a single key string or an array of keys.
 * Silently skips if Redis is unavailable.
 */
async function deleteCache(keys) {
  const client = getClient();
  if (!client) return;

  const keyList = Array.isArray(keys) ? keys : [keys];
  if (keyList.length === 0) return;

  try {
    await client.del(keyList);
  } catch (err) {
    console.warn(`[cache] deleteCache failed for keys [${keyList.join(", ")}]:`, err.message);
  }
}

/**
 * Cache key builders — centralised so naming is consistent across the codebase.
 * Format: <resource>:<identifier>
 */
const CacheKeys = {
  user: (userId) => `user:${userId}`,
  dashboard: (userId) => `dashboard:${userId}`,
  path: (pathId) => `path:${pathId}`,
  video: (videoId) => `video:${videoId}`,
  ytPlaylist: (ytPlaylistId) => `yt:${ytPlaylistId}`,
};

module.exports = { getCache, setCache, deleteCache, CacheKeys };
