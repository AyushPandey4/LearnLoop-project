import React from "react";

export function ProgressBar({ percent = 0, showLabel = false }) {
  const pct = Math.min(100, Math.max(0, percent));

  // Color based on progress level
  const barColor = pct >= 100
    ? "var(--color-success)"
    : pct >= 60
    ? "var(--color-accent)"
    : pct >= 30
    ? "var(--color-accent)"
    : "var(--color-accent)";

  return (
    <div style={{ width: "100%" }}>
      {showLabel && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}>
          <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Progress</span>
          <span style={{
            fontSize: "11px",
            fontWeight: "600",
            color: pct >= 100 ? "var(--color-success)" : "var(--color-text-secondary)",
          }}>
            {pct}%
          </span>
        </div>
      )}
      <div style={{
        width: "100%",
        height: "3px",
        background: "var(--color-surface-active)",
        borderRadius: "2px",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`,
          height: "100%",
          background: barColor,
          borderRadius: "2px",
          transition: "width 0.5s ease-out",
        }} />
      </div>
    </div>
  );
}
