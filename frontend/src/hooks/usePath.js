import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function usePath(pathId) {
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPathDetail = useCallback(async () => {
    if (!pathId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/paths/${pathId}`);
      setPath(res.data.data);
    } catch (err) {
      console.error("Failed to fetch path details:", err);
      setError(err.response?.data?.message || "Failed to load learning path");
    } finally {
      setLoading(false);
    }
  }, [pathId]);

  useEffect(() => {
    fetchPathDetail();
  }, [fetchPathDetail]);

  const updateVideoStatus = async (videoId, newStatus) => {
    try {
      const res = await api.patch(`/videos/${videoId}/status`, { status: newStatus });
      // Optimistic local update
      setPath((prev) => {
        if (!prev) return prev;
        const updatedVideos = prev.videos.map((v) =>
          v._id === videoId ? { ...v, status: newStatus } : v
        );
        const completedCount = updatedVideos.filter((v) => v.status === "completed").length;
        const progress = updatedVideos.length > 0 ? Math.round((completedCount / updatedVideos.length) * 100) : 0;

        return {
          ...prev,
          completedVideos: completedCount,
          progressPercent: progress,
          videos: updatedVideos,
        };
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update video status");
    }
  };

  const updatePathDetails = async (data) => {
    try {
      const res = await api.patch(`/paths/${pathId}`, data);
      setPath((prev) => (prev ? { ...prev, ...res.data.data } : prev));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update learning path");
    }
  };

  return {
    path,
    loading,
    error,
    refresh: fetchPathDetail,
    updateVideoStatus,
    updatePathDetails,
  };
}
