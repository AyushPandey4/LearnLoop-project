import React from "react";

/* ─── Badge ──────────────────────────────────────────────────────────────── */
export function Badge({ children, variant = "default" }) {
  const styles = {
    default: {
      background: "var(--color-surface-2)",
      color: "var(--color-text-secondary)",
      border: "1px solid var(--color-border)",
    },
    primary: {
      background: "var(--color-accent-subtle)",
      color: "var(--color-accent-hover)",
      border: "1px solid var(--color-accent-border)",
    },
    success: {
      background: "var(--color-success-subtle)",
      color: "var(--color-success)",
      border: "1px solid var(--color-success-border)",
    },
    warning: {
      background: "var(--color-warning-subtle)",
      color: "var(--color-warning)",
      border: "1px solid rgba(245,158,11,0.3)",
    },
  };

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 8px",
      borderRadius: "var(--radius-sm)",
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: "0.02em",
      lineHeight: "18px",
      ...styles[variant],
    }}>
      {children}
    </span>
  );
}

/* ─── EmptyState ─────────────────────────────────────────────────────────── */
export function EmptyState({ title, description, action }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "64px 32px",
      textAlign: "center",
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
    }}>
      {/* Icon */}
      <div style={{
        width: "44px",
        height: "44px",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "16px",
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5v9A2.5 2.5 0 0 1 14.5 17h-9A2.5 2.5 0 0 1 3 14.5v-9z" stroke="var(--color-text-muted)" strokeWidth="1.4" fill="none"/>
          <path d="M7 7h6M7 10h6M7 13h4" stroke="var(--color-text-muted)" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 style={{
        fontSize: "15px",
        fontWeight: "600",
        color: "var(--color-text-primary)",
        marginBottom: "6px",
      }}>
        {title}
      </h3>
      {description && (
        <p style={{
          fontSize: "13px",
          color: "var(--color-text-secondary)",
          maxWidth: "360px",
          lineHeight: "1.6",
          marginBottom: "24px",
        }}>
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
