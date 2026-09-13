import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function usePaths() {
  const [pathsData, setPathsData] = useState({ paths: [], overallStats: null });
  const [continueData, setContinueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pathsRes, continueRes] = await Promise.all([
        api.get("/paths"),
        api.get("/paths/continue"),
      ]);

      setPathsData(pathsRes.data.data);
      setContinueData(continueRes.data.data);
    } catch (err) {
      console.error("Failed to fetch dashboard paths:", err);
      setError(err.response?.data?.message || "Failed to load learning paths");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const importPath = async (url, name, category) => {
    try {
      const res = await api.post("/paths", { url, name, category });
      await fetchDashboardData(); // Refresh list after import
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to import YouTube playlist");
    }
  };

  const deletePath = async (id) => {
    try {
      await api.delete(`/paths/${id}`);
      await fetchDashboardData();
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete learning path");
    }
  };

  return {
    paths: pathsData.paths,
    overallStats: pathsData.overallStats,
    continueData,
    loading,
    error,
    refresh: fetchDashboardData,
    importPath,
    deletePath,
  };
}
