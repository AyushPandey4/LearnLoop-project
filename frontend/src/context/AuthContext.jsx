import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

/**
 * AuthContext
 *
 * Provides global authentication state to the entire app.
 * State:
 *   user    — the logged-in user object, or null
 *   loading — true while the initial session check is running
 *
 * Functions:
 *   logout() — clears the session cookie and resets state
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until first /me check completes

  /**
   * Verify the session on mount.
   * Calls GET /api/auth/me — if the httpOnly cookie is present and valid,
   * the backend returns the user object. If not, returns 401.
   */
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Logout — calls the backend to clear the httpOnly cookie,
   * then resets client-side state.
   */
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
