import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ConfirmDialog } from "../ui/ConfirmDialog";

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleConfirmSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      setIsSignOutModalOpen(false);
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setIsSigningOut(false);
    }
  };

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        style={{
          padding: "5px 12px",
          borderRadius: "var(--radius-md)",
          fontSize: "13px",
          fontWeight: active ? "600" : "500",
          color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)",
          background: active ? "var(--color-surface-2)" : "transparent",
          transition: "color 0.15s, background 0.15s",
          border: active ? "1px solid var(--color-border)" : "1px solid transparent",
          textDecoration: "none",
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.color = "var(--color-text-primary)"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.color = "var(--color-text-secondary)"; }}
      >
        {label}
      </Link>
    );
  };

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      backgroundColor: "var(--color-bg)",
      borderBottom: "1px solid var(--color-border)",
      backdropFilter: "none",
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 24px",
        height: "54px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
      }}>
        {/* Left: Brand + Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Logo mark */}
          <Link to="/dashboard" style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            marginRight: "12px",
          }}>
            <img
              src="/learnloop_logo.png"
              alt="LearnLoop Logo"
              style={{
                width: "28px",
                height: "28px",
                objectFit: "contain",
                borderRadius: "var(--radius-sm)",
                flexShrink: 0,
              }}
            />
            <span style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}>
              LearnLoop
            </span>
          </Link>

          {user && (
            <nav style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {navLink("/dashboard", "Dashboard")}
              {navLink("/search", "Notes Search")}
            </nav>
          )}
        </div>

        {/* Right: User / Guest actions */}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "1px solid var(--color-border)",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "var(--color-text-primary)",
                }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
              <span style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "var(--color-text-secondary)",
              }}>
                {user.name?.split(" ")[0]}
              </span>
            </div>

            <button
              onClick={() => setIsSignOutModalOpen(true)}
              style={{
                padding: "5px 10px",
                fontSize: "12px",
                fontWeight: "500",
                color: "var(--color-text-muted)",
                background: "transparent",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "var(--color-text-primary)";
                e.currentTarget.style.borderColor = "var(--color-border-hover)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "var(--color-text-muted)";
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              to="/"
              style={{
                fontSize: "13px",
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                fontWeight: "500",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-secondary)"}
            >
              Home
            </Link>
            <a
              href="/api/auth/google"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: "500",
                color: "var(--color-text-primary)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-hover)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                transition: "background 0.13s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--color-surface-hover)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--color-surface)"}
            >
              Sign in with Google
            </a>
          </div>
        )}
      </div>

      {/* ── Sign Out Confirmation Dialog ── */}
      <ConfirmDialog
        isOpen={isSignOutModalOpen}
        onClose={() => { if (!isSigningOut) setIsSignOutModalOpen(false); }}
        onConfirm={handleConfirmSignOut}
        title="Sign out of LearnLoop"
        itemTitle={user?.name ? `${user.name}${user.email ? ` · ${user.email}` : ""}` : user?.email}
        description="Are you sure you want to sign out? You will need to sign in with Google again to access your learning workspace."
        confirmText="Sign out"
        cancelText="Cancel"
        loadingText="Signing out..."
        iconType="logout"
        variant="danger"
        isLoading={isSigningOut}
      />
    </header>
  );
}

/* ─── Layout ─────────────────────────────────────────────────────────────── */
export function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{
        flex: 1,
        maxWidth: "1280px",
        width: "100%",
        margin: "0 auto",
        padding: "28px 24px 48px",
      }}>
        {children}
      </main>
    </div>
  );
}
