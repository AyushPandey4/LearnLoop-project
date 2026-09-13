"use strict";

/**
 * Parses an ISO 8601 duration string (e.g., "PT1H2M34S", "PT15M", "PT45S")
 * into total seconds.
 */
export function parseIsoDuration(durationStr) {
  if (!durationStr || typeof durationStr !== "string") return 0;

  const match = durationStr.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i);
  if (!match) return 0;

  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Converts total seconds into a human-readable duration string.
 * e.g., 14854 -> "4h 7m"
 * e.g., 2100 -> "35m"
 * e.g., 45 -> "45s"
 */
export function formatSecondsToTime(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return "0m";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
}

/**
 * Calculates total and remaining playlist duration at 1x, 1.5x, and 2x playback speeds.
 * Expects an array of video objects with `duration` and `status` fields.
 */
export function calculatePlaylistDurations(videos = []) {
  let totalSeconds = 0;
  let remainingSeconds = 0;

  videos.forEach((video) => {
    const sec = parseIsoDuration(video.duration);
    totalSeconds += sec;

    if (video.status !== "completed") {
      remainingSeconds += sec;
    }
  });

  return {
    total: {
      totalSeconds,
      speed1x: formatSecondsToTime(totalSeconds),
      speed1_5x: formatSecondsToTime(Math.round(totalSeconds / 1.5)),
      speed2x: formatSecondsToTime(Math.round(totalSeconds / 2.0)),
    },
    remaining: {
      remainingSeconds,
      speed1x: formatSecondsToTime(remainingSeconds),
      speed1_5x: formatSecondsToTime(Math.round(remainingSeconds / 1.5)),
      speed2x: formatSecondsToTime(Math.round(remainingSeconds / 2.0)),
    },
  };
}
