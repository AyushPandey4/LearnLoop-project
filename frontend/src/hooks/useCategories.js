import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

function normalizeCategories(raw) {
  if (!Array.isArray(raw)) return ["All"];
  return Array.from(new Set(["All", ...raw.filter(Boolean)]));
}

export function useCategories() {
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/user/categories");
      setCategories(normalizeCategories(res.data.data));
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (name) => {
    try {
      const res = await api.post("/user/categories", { name });
      setCategories(normalizeCategories(res.data.data));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to add category");
    }
  };

  const renameCategory = async (oldName, newName) => {
    try {
      const res = await api.put(`/user/categories/${encodeURIComponent(oldName)}`, { newName });
      setCategories(normalizeCategories(res.data.data));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to rename category");
    }
  };

  const deleteCategory = async (name) => {
    try {
      const res = await api.delete(`/user/categories/${encodeURIComponent(name)}`);
      setCategories(normalizeCategories(res.data.data));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete category");
    }
  };

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    addCategory,
    renameCategory,
    deleteCategory,
  };
}
