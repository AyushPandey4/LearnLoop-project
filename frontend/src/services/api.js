import axios from "axios";

/**
 * Centralized axios instance for all API calls.
 */
const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // Required for httpOnly cookies to be sent cross-origin
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor — handles session expiry globally.
 * Only redirects on 401 if the user is NOT already on the landing page ("/").
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/"
    ) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
