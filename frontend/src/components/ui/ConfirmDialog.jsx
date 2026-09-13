import React, { useEffect, useState } from "react";

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  itemTitle,
  description = "Please confirm this action.",
  subNote,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loadingText = "Processing...",
  variant = "danger",
  iconType = "trash",
  isLoading = false,
  error = null,
}) {
  const [cancelHovered, setCancelHovered] = useState(false);
  const [confirmHovered, setConfirmHovered] = useState(false);
  const [confirmActive, setConfirmActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const renderIcon = () => {
    if (iconType === "logout") {
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    // Default trash icon
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const isDanger = variant === "danger";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 110,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(0, 0, 0, 0.78)",
        backdropFilter: "blur(4px)",
      }}
    >
      {/* Backdrop */}
      <div
        style={{ position: "fixed", inset: 0 }}
        onClick={() => { if (!isLoading) onClose(); }}
      />

      {/* Dialog card */}
      <div
        className="animate-modal"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "430px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-md)",
                background: isDanger ? "rgba(239, 68, 68, 0.12)" : "rgba(59, 130, 246, 0.12)",
                border: `1px solid ${isDanger ? "rgba(239, 68, 68, 0.25)" : "rgba(59, 130, 246, 0.25)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDanger ? "var(--color-error)" : "var(--color-accent)",
                flexShrink: 0,
              }}
            >
              {renderIcon()}
            </div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--color-text-primary)",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </h3>
          </div>

          <button
            onClick={() => { if (!isLoading) onClose(); }}
            disabled={isLoading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "26px",
              height: "26px",
              borderRadius: "var(--radius-md)",
              background: "transparent",
              border: "none",
              color: "var(--color-text-muted)",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = "var(--color-surface-2)";
                e.currentTarget.style.color = "var(--color-text-primary)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "20px" }}>
          {error && (
            <div
              style={{
                marginBottom: "14px",
                padding: "10px 12px",
                background: "var(--color-error-subtle)",
                border: "1px solid var(--color-error-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
                color: "var(--color-error)",
                lineHeight: "1.5",
              }}
            >
              {error}
            </div>
          )}

          {itemTitle && (
            <div
              style={{
                padding: "10px 12px",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              {iconType === "logout" ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: "var(--color-accent)", flexShrink: 0 }}>
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
                </svg>
              )}
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--color-text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {itemTitle}
              </span>
            </div>
          )}

          <p
            style={{
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            {description}
          </p>

          {subNote && (
            <p
              style={{
                marginTop: "10px",
                fontSize: "12px",
                color: "var(--color-text-muted)",
                lineHeight: "1.5",
                marginBottom: 0,
              }}
            >
              {subNote}
            </p>
          )}
        </div>

        {/* Modal Actions */}
        <div
          style={{
            padding: "14px 20px",
            background: "var(--color-surface-2)",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          {/* Cancel button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            onMouseEnter={() => setCancelHovered(true)}
            onMouseLeave={() => setCancelHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "7px 14px",
              fontSize: "13px",
              fontWeight: "500",
              fontFamily: "var(--font-sans)",
              borderRadius: "var(--radius-md)",
              cursor: isLoading ? "not-allowed" : "pointer",
              background: cancelHovered ? "var(--color-surface-hover)" : "var(--color-surface)",
              color: cancelHovered ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              border: "1px solid var(--color-border)",
              transition: "background 0.12s, color 0.12s, border-color 0.12s",
              outline: "none",
              whiteSpace: "nowrap",
            }}
          >
            {cancelText}
          </button>

          {/* Confirm Action button */}
          <button
            onClick={onConfirm}
            disabled={isLoading}
            onMouseEnter={() => setConfirmHovered(true)}
            onMouseLeave={() => { setConfirmHovered(false); setConfirmActive(false); }}
            onMouseDown={() => setConfirmActive(true)}
            onMouseUp={() => setConfirmActive(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              padding: "7px 16px",
              fontSize: "13px",
              fontWeight: "600",
              fontFamily: "var(--font-sans)",
              borderRadius: "var(--radius-md)",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
              background: isDanger
                ? confirmHovered ? "#dc2626" : "#b91c1c"
                : confirmHovered ? "var(--color-accent-hover)" : "var(--color-accent)",
              color: "#ffffff",
              border: `1px solid ${isDanger ? "rgba(255, 255, 255, 0.1)" : "transparent"}`,
              boxShadow: isDanger
                ? confirmHovered ? "0 2px 8px rgba(220, 38, 38, 0.4)" : "0 1px 3px rgba(0, 0, 0, 0.3)"
                : confirmHovered ? "0 2px 8px rgba(59, 130, 246, 0.4)" : "0 1px 3px rgba(0, 0, 0, 0.3)",
              transform: confirmActive ? "scale(0.98)" : "scale(1)",
              transition: "background 0.13s, box-shadow 0.13s, transform 0.08s, opacity 0.13s",
              outline: "none",
              whiteSpace: "nowrap",
            }}
          >
            {isLoading ? (
              <>
                <svg
                  style={{ animation: "spin 0.8s linear infinite" }}
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{loadingText}</span>
              </>
            ) : (
              <>
                {renderIcon()}
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
