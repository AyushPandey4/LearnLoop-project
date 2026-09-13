import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { useVideo } from "../hooks/useVideo";
import { useDebounce } from "../hooks/useDebounce";
import { EmptyState } from "../components/ui/UIHelpers";
import { Button } from "../components/ui/Button";

/* ─── Status pill ────────────────────────────────────────────────────────── */
function StatusPill({ current, value, label, activeStyle, onClick }) {
  const isActive = current === value;
  const [hovered, setHovered] = useState(false);

  const base = {
    padding: "4px 12px",
    borderRadius: "var(--radius-sm)",
    fontSize: "12px",
    fontWeight: "500",
    border: "1px solid transparent",
    cursor: "pointer",
    transition: "background 0.13s, color 0.13s, border-color 0.13s",
    lineHeight: "1.5",
    whiteSpace: "nowrap",
    fontFamily: "var(--font-sans)",
  };

  const inactive = {
    background: "transparent",
    color: hovered ? "var(--color-text-primary)" : "var(--color-text-muted)",
    borderColor: hovered ? "var(--color-border)" : "transparent",
  };

  return (
    <button
      style={{ ...base, ...(isActive ? activeStyle : inactive) }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  );
}

/* ─── Save status indicator ──────────────────────────────────────────────── */
function SaveIndicator({ saving, lastSaved }) {
  if (saving) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "var(--color-warning)", fontFamily: "var(--font-mono)" }}>
        <span style={{
          width: "6px", height: "6px", borderRadius: "50%",
          border: "1.5px solid currentColor",
          borderTopColor: "transparent",
          animation: "spin 0.7s linear infinite",
          display: "inline-block",
          flexShrink: 0,
        }} />
        saving
      </span>
    );
  }
  if (lastSaved) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "var(--color-success)", fontFamily: "var(--font-mono)" }}>
        <span style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: "var(--color-success)",
          display: "inline-block",
          flexShrink: 0,
        }} />
        saved
      </span>
    );
  }
  return null;
}

/* ─── VideoDetail page ───────────────────────────────────────────────────── */
export function VideoDetail() {
  const { id } = useParams();
  const { video, loading, error, updateStatus, updateNotes } = useVideo(id);

  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (video) setNotes(video.notes || "");
  }, [video?._id]);

  const debouncedNotes = useDebounce(notes, 800);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (video && debouncedNotes !== video.notes) {
      const save = async () => {
        setSavingNotes(true);
        try {
          await updateNotes(debouncedNotes);
          setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        } catch (err) {
          console.error("Auto-save failed:", err);
        } finally {
          setSavingNotes(false);
        }
      };
      save();
    }
  }, [debouncedNotes]);

  const handleStatusToggle = async (newStatus) => {
    try { await updateStatus(newStatus); }
    catch (err) { alert(err.message); }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <Layout>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", paddingTop: "8px" }}>
          {/* Left skeleton */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="animate-skeleton" style={{ width: "100%", aspectRatio: "16/9", borderRadius: "var(--radius-lg)" }} />
            <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="animate-skeleton" style={{ width: "30%", height: "11px" }} />
              <div className="animate-skeleton" style={{ width: "75%", height: "18px" }} />
              <div className="animate-skeleton" style={{ width: "50%", height: "11px" }} />
            </div>
          </div>
          {/* Right skeleton */}
          <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "20px" }}>
            <div className="animate-skeleton" style={{ width: "50%", height: "14px", marginBottom: "16px" }} />
            <div className="animate-skeleton" style={{ width: "100%", height: "300px", borderRadius: "var(--radius-md)" }} />
          </div>
        </div>
      </Layout>
    );
  }

  /* ── Error ── */
  if (error || !video) {
    return (
      <Layout>
        <EmptyState
          title="Video Not Found"
          description={error || "This video does not exist or has been removed."}
          action={
            <Link to="/dashboard">
              <Button variant="primary" size="sm">Back to Dashboard</Button>
            </Link>
          }
        />
      </Layout>
    );
  }

  const statusConfigs = [
    {
      value: "to-watch",
      label: "Queue",
      activeStyle: { background: "var(--color-surface-2)", color: "var(--color-text-primary)", borderColor: "var(--color-border-hover)" },
    },
    {
      value: "in-progress",
      label: "In Progress",
      activeStyle: { background: "var(--color-warning-subtle)", color: "var(--color-warning)", borderColor: "rgba(245,158,11,0.35)" },
    },
    {
      value: "completed",
      label: "Done",
      activeStyle: { background: "var(--color-success-subtle)", color: "var(--color-success)", borderColor: "rgba(52,211,153,0.3)" },
    },
  ];

  const pathId = video.learningPathId?._id || video.learningPathId;
  const pathName = video.learningPathId?.name || "Playlist";

  return (
    <Layout>
      {/* Back */}
      {pathId && (
        <Link
          to={`/paths/${pathId}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "12px",
            color: "var(--color-text-muted)",
            marginBottom: "16px",
            transition: "color 0.13s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-secondary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {pathName}
        </Link>
      )}

      {/* ── Two-column grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: "20px",
        alignItems: "start",
      }}>

        {/* ── LEFT: player + info ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", minWidth: 0 }}>

          {/* Video embed */}
          <div style={{
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            background: "#000",
            border: "1px solid var(--color-border)",
          }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.ytId}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
          </div>

          {/* Info card */}
          <div style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "18px 20px",
            animation: "fade-up 0.22s ease-out both",
          }}>
            {/* Meta row */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-muted)",
              }}>
                {video.position + 1}
              </span>
              {video.ytId && (
                <>
                  <span style={{ width: "1px", height: "11px", background: "var(--color-border)", display: "inline-block" }} />
                  <a
                    href={`https://www.youtube.com/watch?v=${video.ytId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11px",
                      fontWeight: "500",
                      color: "var(--color-text-muted)",
                      transition: "color 0.13s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--color-accent)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.58 7.19a2.71 2.71 0 0 0-1.9-1.91C18.07 5 12 5 12 5s-6.07 0-7.68.28A2.71 2.71 0 0 0 2.42 7.19 28.27 28.27 0 0 0 2 12a28.27 28.27 0 0 0 .42 4.81 2.71 2.71 0 0 0 1.9 1.91C5.93 19 12 19 12 19s6.07 0 7.68-.28a2.71 2.71 0 0 0 1.9-1.91A28.27 28.27 0 0 0 22 12a28.27 28.27 0 0 0-.42-4.81zM10 15V9l5.2 3z"/>
                    </svg>
                    Watch on YouTube
                  </a>
                </>
              )}
            </div>

            {/* Title + status row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
              <h1 style={{
                fontSize: "17px",
                fontWeight: "600",
                color: "var(--color-text-primary)",
                lineHeight: "1.35",
                flex: 1,
                minWidth: 0,
              }}>
                {video.title}
              </h1>

              {/* Status pills */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "2px",
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "3px",
                flexShrink: 0,
              }}>
                {statusConfigs.map(cfg => (
                  <StatusPill
                    key={cfg.value}
                    current={video.status}
                    value={cfg.value}
                    label={cfg.label}
                    activeStyle={cfg.activeStyle}
                    onClick={() => handleStatusToggle(cfg.value)}
                  />
                ))}
              </div>
            </div>

            {/* Description — collapsible */}
            {video.description && (
              <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--color-border)" }}>
                <button
                  onClick={() => setDescExpanded(p => !p)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    marginBottom: "8px",
                    color: "var(--color-text-muted)",
                    fontSize: "11px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontFamily: "var(--font-sans)",
                    transition: "color 0.13s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-secondary)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}
                >
                  Description
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{ transition: "transform 0.15s", transform: descExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <p style={{
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                  lineHeight: "1.7",
                  whiteSpace: "pre-wrap",
                  display: descExpanded ? "block" : "-webkit-box",
                  WebkitLineClamp: descExpanded ? "unset" : 3,
                  WebkitBoxOrient: "vertical",
                  overflow: descExpanded ? "visible" : "hidden",
                }}>
                  {video.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: sticky notes panel ── */}
        <div style={{ position: "sticky", top: "76px" }}>
          <div style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 110px)",
            minHeight: "440px",
            overflow: "hidden",
          }}>
            {/* Notes header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              borderBottom: "1px solid var(--color-border)",
              flexShrink: 0,
            }}>
              {/* Left: icon + title */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h7A1.5 1.5 0 0 1 13 3.5v9A1.5 1.5 0 0 1 11.5 14h-7A1.5 1.5 0 0 1 3 12.5v-9z" stroke="var(--color-text-muted)" strokeWidth="1.3" fill="none"/>
                  <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke="var(--color-text-muted)" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text-primary)" }}>
                  Notes
                </span>
              </div>

              {/* Right: char count + save status */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {notes.length > 0 && (
                  <span style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-text-muted)",
                  }}>
                    {notes.length} chars
                  </span>
                )}
                <SaveIndicator saving={savingNotes} lastSaved={lastSavedTime} />
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Write your notes, takeaways, or code snippets here..."
              style={{
                flex: 1,
                width: "100%",
                padding: "16px 18px",
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                fontSize: "12.5px",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-sans)",
                lineHeight: "1.75",
                caretColor: "var(--color-accent)",
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default VideoDetail;
