import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import PathDetail from "./pages/PathDetail";
import VideoDetail from "./pages/VideoDetail";
import NotesSearch from "./pages/NotesSearch";
import Legal from "./pages/Legal";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/terms" element={<Legal />} />
      <Route path="/privacy" element={<Legal />} />

      {/* Protected — require authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paths/:id"
        element={
          <ProtectedRoute>
            <PathDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/video/:id"
        element={
          <ProtectedRoute>
            <VideoDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <NotesSearch />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              gap: "1rem",
            }}
          >
            <h2 style={{ color: "var(--color-text-primary)" }}>404</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>Page not found</p>
            <a href="/" style={{ color: "var(--color-accent)" }}>
              Go home
            </a>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
