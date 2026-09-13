import React from "react";
import { Link } from "react-router-dom";
import { ProgressBar } from "../ui/ProgressBar";
import { Badge } from "../ui/UIHelpers";

export function PathCard({ path, onDelete }) {
  const {
    _id,
    name,
    category,
    thumbnail,
    channelTitle,
    totalVideos = 0,
    completedVideos = 0,
    progressPercent = 0,
    isCompleted,
  } = path;

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-border-hover)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-border)"}
    >
      {/* Thumbnail */}
      <Link
        to={`/paths/${_id}`}
        style={{
          position: "relative",
          display: "block",
          aspectRatio: "16/9",
          background: "var(--color-surface-2)",
          overflow: "hidden",
        }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="1" y="1" width="30" height="30" rx="4" stroke="var(--color-border)" strokeWidth="1.5"/>
              <path d="M12 10l10 6-10 6V10z" fill="var(--color-text-muted)"/>
            </svg>
          </div>
        )}

        {/* Category badge */}
        <div style={{ position: "absolute", top: "8px", left: "8px" }}>
          <Badge variant={isCompleted ? "success" : "primary"}>
            {category || "All"}
          </Badge>
        </div>

        {/* Video count */}
        <div style={{
          position: "absolute",
          bottom: "7px",
          right: "7px",
          background: "rgba(0,0,0,0.82)",
          color: "#fff",
          fontSize: "10px",
          fontFamily: "var(--font-mono)",
          fontWeight: "600",
          padding: "2px 6px",
          borderRadius: "var(--radius-sm)",
        }}>
          {completedVideos}/{totalVideos}
        </div>
      </Link>

      {/* Body */}
      <div style={{
        padding: "14px 14px 12px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        gap: "10px",
      }}>
        {/* Title + channel */}
        <div style={{ flex: 1 }}>
          <Link to={`/paths/${_id}`} style={{ textDecoration: "none" }}>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--color-text-primary)",
                lineHeight: "1.4",
                marginBottom: "4px",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--color-accent-hover)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-primary)"}
            >
              {name}
            </h3>
          </Link>

          {channelTitle && (
            <p style={{
              fontSize: "12px",
              color: "var(--color-text-muted)",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}>
              {channelTitle}
            </p>
          )}
        </div>

        {/* Progress section */}
        <div style={{
          paddingTop: "10px",
          borderTop: "1px solid var(--color-border)",
        }}>
          <ProgressBar percent={progressPercent} />

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "8px",
          }}>
            <Link
              to={`/paths/${_id}`}
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--color-accent)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--color-accent-hover)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--color-accent)"}
            >
              Open path
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            <button
              onClick={() => onDelete(_id, name)}
              title={`Remove "${name}"`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                fontWeight: "500",
                color: "var(--color-text-muted)",
                background: "transparent",
                border: "1px solid transparent",
                borderRadius: "var(--radius-sm)",
                padding: "2px 7px",
                cursor: "pointer",
                transition: "all 0.12s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "var(--color-error)";
                e.currentTarget.style.background = "var(--color-error-subtle)";
                e.currentTarget.style.borderColor = "var(--color-error-border)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "var(--color-text-muted)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
