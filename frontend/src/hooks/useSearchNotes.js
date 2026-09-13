import { useState, useCallback } from "react";
import api from "../services/api";

export function useSearchNotes() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query) => {
    if (!query || !query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/search/notes?q=${encodeURIComponent(query.trim())}`);
      setResults(res.data.data);
    } catch (err) {
      console.error("Notes search failed:", err);
      setError(err.response?.data?.message || "Failed to search notes");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    search,
  };
}
