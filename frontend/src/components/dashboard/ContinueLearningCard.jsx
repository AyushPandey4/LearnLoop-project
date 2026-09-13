import React from "react";
import { Link } from "react-router-dom";

export function ContinueLearningCard({ continueData }) {
  if (!continueData || !continueData.video) return null;

  const { video, learningPath } = continueData;

  return (
    <div
      className="animate-fade-up"
      style={{
        marginBottom: "28px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* Top label strip */}
      <div style={{
        padding: "8px 16px",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}>
        {/* Play icon */}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="6.5" cy="6.5" r="6" stroke="var(--color-accent)" strokeWidth="1.2"/>
          <path d="M5 4.5l4 2-4 2V4.5z" fill="var(--color-accent)"/>
        </svg>
        <span style={{
          fontSize: "11px",
          fontWeight: "600",
          color: "var(--color-accent)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          Continue where you left off
        </span>
        {learningPath?.category && (
          <span style={{
            marginLeft: "4px",
            fontSize: "11px",
            color: "var(--color-text-muted)",
          }}>
            &middot; {learningPath.category}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "14px 16px",
      }}>
        {/* Thumbnail */}
        <div style={{
          position: "relative",
          width: "140px",
          height: "79px",
          flexShrink: 0,
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
        }}>
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 5l11 7-11 7V5z" fill="var(--color-text-muted)"/>
              </svg>
            </div>
          )}
          {/* Position badge */}
          <div style={{
            position: "absolute",
            bottom: "4px",
            right: "4px",
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            fontSize: "10px",
            fontFamily: "var(--font-mono)",
            padding: "1px 5px",
            borderRadius: "var(--radius-sm)",
            fontWeight: "600",
          }}>
            #{video.position + 1}
          </div>
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--color-text-primary)",
            marginBottom: "4px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}>
            {video.title}
          </h2>
          <p style={{
            fontSize: "12px",
            color: "var(--color-text-muted)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}>
            from <span style={{ color: "var(--color-text-secondary)" }}>{learningPath?.name || "Learning Path"}</span>
          </p>
        </div>

        {/* CTA */}
        <div style={{ flexShrink: 0 }}>
          <Link
            to={`/video/${video._id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              background: "var(--color-accent)",
              color: "#fff",
              borderRadius: "var(--radius-md)",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--color-accent-hover)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--color-accent)"}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 2l6 4-6 4V2z" fill="currentColor"/>
            </svg>
            Resume
          </Link>
        </div>
      </div>
    </div>
  );
}
