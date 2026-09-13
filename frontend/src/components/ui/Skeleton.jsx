import React from "react";

/* ─── Base Skeleton ──────────────────────────────────────────────────────── */
export function Skeleton({ className = "", style = {} }) {
  return (
    <div
      className={`animate-skeleton ${className}`}
      style={style}
    />
  );
}

/* ─── PathCard Skeleton ──────────────────────────────────────────────────── */
export function PathCardSkeleton() {
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
    }}>
      {/* Thumbnail */}
      <div className="animate-skeleton" style={{ width: "100%", aspectRatio: "16/9" }} />
      {/* Body */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <Skeleton style={{ width: "70%", height: "16px", borderRadius: "var(--radius-sm)" }} />
        <Skeleton style={{ width: "45%", height: "12px", borderRadius: "var(--radius-sm)" }} />
        <div style={{ marginTop: "8px", paddingTop: "12px", borderTop: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "8px" }}>
          <Skeleton style={{ width: "100%", height: "4px", borderRadius: "2px" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Skeleton style={{ width: "60px", height: "12px" }} />
            <Skeleton style={{ width: "40px", height: "12px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── VideoRow Skeleton ──────────────────────────────────────────────────── */
export function VideoRowSkeleton() {
  return (
    <div style={{
      padding: "14px 16px",
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      display: "flex",
      alignItems: "center",
      gap: "16px",
    }}>
      <Skeleton style={{ width: "20px", height: "14px", flexShrink: 0 }} />
      <Skeleton style={{ width: "112px", height: "64px", borderRadius: "var(--radius-md)", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <Skeleton style={{ width: "65%", height: "14px" }} />
        <Skeleton style={{ width: "35%", height: "11px" }} />
      </div>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <Skeleton style={{ width: "64px", height: "30px", borderRadius: "var(--radius-md)" }} />
        <Skeleton style={{ width: "64px", height: "30px", borderRadius: "var(--radius-md)" }} />
      </div>
    </div>
  );
}
