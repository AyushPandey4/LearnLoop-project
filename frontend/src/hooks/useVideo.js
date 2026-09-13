import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useVideo(videoId) {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideo = useCallback(async () => {
    if (!videoId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/videos/${videoId}`);
      setVideo(res.data.data);
    } catch (err) {
      console.error("Failed to fetch video:", err);
      setError(err.response?.data?.message || "Failed to load video details");
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  const updateStatus = async (newStatus) => {
    try {
      const res = await api.patch(`/videos/${videoId}/status`, { status: newStatus });
      setVideo((prev) => (prev ? { ...prev, status: newStatus } : prev));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update video status");
    }
  };

  const updateNotes = async (newNotes) => {
    try {
      const res = await api.patch(`/videos/${videoId}/notes`, { notes: newNotes });
      setVideo((prev) => (prev ? { ...prev, notes: newNotes } : prev));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to save notes");
    }
  };

  return {
    video,
    loading,
    error,
    refresh: fetchVideo,
    updateStatus,
    updateNotes,
  };
}
