import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { usePath } from "../hooks/usePath";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Badge, EmptyState } from "../components/ui/UIHelpers";
import { Button } from "../components/ui/Button";
import { VideoRowSkeleton } from "../components/ui/Skeleton";
import { EditPathModal } from "../components/path/EditPathModal";
import { calculatePlaylistDurations, parseIsoDuration, formatSecondsToTime } from "../utils/formatDuration";

/* ─── Status pill ────────────────────────────────────────────────────────── */
function StatusPill({ current, value, label, activeStyle, onClick }) {
  const isActive = current === value;
  const [hovered, setHovered] = React.useState(false);

  const baseStyle = {
    padding: "3px 9px",
    borderRadius: "var(--radius-sm)",
    fontSize: "11px",
    fontWeight: "500",
    border: "1px solid transparent",
    cursor: "pointer",
    transition: "background 0.13s, color 0.13s, border-color 0.13s",
    lineHeight: "1.5",
    whiteSpace: "nowrap",
  };

  const inactiveStyle = {
    background: "transparent",
    color: hovered ? "var(--color-text-primary)" : "var(--color-text-muted)",
    borderColor: hovered ? "var(--color-border)" : "transparent",
  };

  return (
    <button
      style={{ ...baseStyle, ...(isActive ? activeStyle : inactiveStyle) }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  );
}

/* ─── Video row ──────────────────────────────────────────────────────────── */
function VideoRow({ video, onStatusChange }) {
  const [hovered, setHovered] = React.useState(false);
  const isCompleted = video.status === "completed";
  const isInProgress = video.status === "in-progress";

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "12px 14px",
    background: "var(--color-surface)",
    borderRadius: "var(--radius-lg)",
    border: `1px solid ${
      isCompleted
        ? "rgba(52,211,153,0.22)"
        : isInProgress
        ? "rgba(245,158,11,0.2)"
        : hovered
        ? "var(--color-border-hover)"
        : "var(--color-border)"
    }`,
    transition: "border-color 0.15s",
  };

  const statusConfigs = [
    {
      value: "to-watch",
      label: "Queue",
      activeStyle: {
        background: "var(--color-surface-2)",
        color: "var(--color-text-primary)",
        borderColor: "var(--color-border-hover)",
      },
    },
    {
      value: "in-progress",
      label: "In Progress",
      activeStyle: {
        background: "var(--color-warning-subtle)",
        color: "var(--color-warning)",
        borderColor: "rgba(245,158,11,0.35)",
      },
    },
    {
      value: "completed",
      label: "Done",
      activeStyle: {
        background: "var(--color-success-subtle)",
        color: "var(--color-success)",
        borderColor: "rgba(52,211,153,0.3)",
      },
    },
  ];

  return (
    <div
      style={rowStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Position */}
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "var(--color-text-muted)",
        width: "22px",
        flexShrink: 0,
        textAlign: "right",
      }}>
        {video.position + 1}
      </span>

      {/* Thumbnail */}
      <Link
        to={`/video/${video._id}`}
        style={{
          position: "relative",
          width: "100px",
          height: "58px",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          background: "#0a0c12",
          flexShrink: 0,
          display: "block",
          border: "1px solid var(--color-border)",
        }}
      >
        {video.thumbnail ? (
          <>
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {video.duration && (
              <span style={{
                position: "absolute",
                bottom: "3px",
                right: "4px",
                background: "rgba(0,0,0,0.85)",
                color: "#fff",
                fontSize: "9px",
                fontFamily: "var(--font-mono)",
                padding: "1px 4px",
                borderRadius: "2px",
              }}>
                {formatSecondsToTime(parseIsoDuration(video.duration))}
              </span>
            )}
          </>
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            color: "var(--color-text-muted)",
          }}>
            No Preview
          </div>
        )}
      </Link>

      {/* Title + notes indicator */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link
          to={`/video/${video._id}`}
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "500",
            color: "var(--color-text-primary)",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            marginBottom: video.notes ? "4px" : 0,
            transition: "color 0.13s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--color-accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--color-text-primary)"; }}
        >
          {video.title}
        </Link>
        {video.notes && (
          <span style={{
            fontSize: "10px",
            color: "var(--color-accent)",
            fontWeight: "500",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M4 4h8M4 7h8M4 10h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Notes saved
          </span>
        )}
      </div>

      {/* Status pills */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
        {statusConfigs.map(cfg => (
          <StatusPill
            key={cfg.value}
            current={video.status}
            value={cfg.value}
            label={cfg.label}
            activeStyle={cfg.activeStyle}
            onClick={() => onStatusChange(video._id, cfg.value)}
          />
        ))}
      </div>

      {/* Watch link */}
      <Link
        to={`/video/${video._id}`}
        style={{
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "5px 11px",
          borderRadius: "var(--radius-md)",
          fontSize: "12px",
          fontWeight: "500",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border)",
          background: "transparent",
          transition: "background 0.13s, border-color 0.13s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "var(--color-surface-2)";
          e.currentTarget.style.borderColor = "var(--color-border-hover)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "var(--color-border)";
        }}
      >
        Watch
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M3 5h5M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </div>
  );
}

/* ─── Duration stat ──────────────────────────────────────────────────────── */
function DurationStat({ speed, value, dimmed }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <span style={{
        fontSize: "10px",
        color: "var(--color-text-muted)",
        fontFamily: "var(--font-mono)",
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}>
        {speed}
      </span>
      <span style={{
        fontSize: "13px",
        fontFamily: "var(--font-mono)",
        fontWeight: "600",
        color: dimmed ? "var(--color-text-secondary)" : "var(--color-text-primary)",
      }}>
        {value}
      </span>
    </div>
  );
}

export function PathDetail() {
  const { id } = useParams();
  const { path, loading, error, updateVideoStatus, updatePathDetails } = usePath(id);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterHovered, setFilterHovered] = useState(null);

  const durations = useMemo(() => {
    return calculatePlaylistDurations(path?.videos || []);
  }, [path?.videos]);

  const filteredVideos = useMemo(() => {
    if (!path?.videos) return [];
    return path.videos.filter((v) => {
      const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [path?.videos, searchQuery, statusFilter]);

  const handleStatusChange = async (videoId, newStatus) => {
    try {
      await updateVideoStatus(videoId, newStatus);
    } catch (err) {
      alert(err.message);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <Layout>
        <div style={{ paddingTop: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            display: "flex",
            gap: "18px",
          }}>
            <div className="animate-skeleton" style={{ width: "160px", height: "92px", borderRadius: "var(--radius-md)", flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="animate-skeleton" style={{ width: "50%", height: "12px" }} />
              <div className="animate-skeleton" style={{ width: "80%", height: "18px" }} />
              <div className="animate-skeleton" style={{ width: "60%", height: "12px" }} />
              <div className="animate-skeleton" style={{ width: "100%", height: "4px", marginTop: "8px" }} />
            </div>
          </div>
          <VideoRowSkeleton />
          <VideoRowSkeleton />
          <VideoRowSkeleton />
          <VideoRowSkeleton />
        </div>
      </Layout>
    );
  }

  /* ── Error ── */
  if (error || !path) {
    return (
      <Layout>
        <EmptyState
          title="Playlist Not Found"
          description={error || "This learning path may have been deleted."}
          action={
            <Link to="/dashboard">
              <Button variant="primary" size="sm">Back to Dashboard</Button>
            </Link>
          }
        />
      </Layout>
    );
  }

  const filterTabs = [
    { id: "all", label: "All", count: path.videos?.length || 0 },
    { id: "to-watch", label: "Queue", count: path.videos?.filter(v => v.status === "to-watch").length || 0 },
    { id: "in-progress", label: "In Progress", count: path.videos?.filter(v => v.status === "in-progress").length || 0 },
    { id: "completed", label: "Done", count: path.videos?.filter(v => v.status === "completed").length || 0 },
  ];

  return (
    <Layout>
      {/* Back */}
      <Link
        to="/dashboard"
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
        Dashboard
      </Link>

      {/* ── Header card ── */}
      <div style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        marginBottom: "20px",
        animation: "fade-up 0.22s ease-out both",
      }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

          {/* Thumbnail */}
          {path.thumbnail && (
            <img
              src={path.thumbnail}
              alt={path.name}
              style={{
                width: "160px",
                height: "92px",
                objectFit: "cover",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                flexShrink: 0,
              }}
            />
          )}

          {/* Info column */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "10px" }}>

            {/* Top row: category + actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Badge variant="primary">{path.category || "All"}</Badge>
                {path.channelTitle && (
                  <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                    {path.channelTitle}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {(path.ytPlaylistUrl || path.ytPlaylistId) && (
                  <a
                    href={path.ytPlaylistUrl || `https://www.youtube.com/playlist?list=${path.ytPlaylistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "5px 11px",
                      borderRadius: "var(--radius-md)",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "var(--color-text-secondary)",
                      border: "1px solid var(--color-border)",
                      background: "transparent",
                      transition: "color 0.13s, border-color 0.13s, background 0.13s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "var(--color-text-primary)";
                      e.currentTarget.style.background = "var(--color-surface-2)";
                      e.currentTarget.style.borderColor = "var(--color-border-hover)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "var(--color-text-secondary)";
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "var(--color-border)";
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.58 7.19a2.71 2.71 0 0 0-1.9-1.91C18.07 5 12 5 12 5s-6.07 0-7.68.28A2.71 2.71 0 0 0 2.42 7.19 28.27 28.27 0 0 0 2 12a28.27 28.27 0 0 0 .42 4.81 2.71 2.71 0 0 0 1.9 1.91C5.93 19 12 19 12 19s6.07 0 7.68-.28a2.71 2.71 0 0 0 1.9-1.91A28.27 28.27 0 0 0 22 12a28.27 28.27 0 0 0-.42-4.81zM10 15V9l5.2 3z"/>
                    </svg>
                    View on YouTube
                  </a>
                )}
                <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
                  Edit
                </Button>
              </div>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: "18px", fontWeight: "600", color: "var(--color-text-primary)", lineHeight: "1.3" }}>
              {path.name}
            </h1>

            {/* Description */}
            {path.description && (
              <p style={{
                fontSize: "12px",
                color: "var(--color-text-secondary)",
                lineHeight: "1.6",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {path.description}
              </p>
            )}

            {/* Duration stats — two columns: Total | Remaining */}
            {durations.total.totalSeconds > 0 && (
              <div style={{
                display: "flex",
                gap: "0",
                borderTop: "1px solid var(--color-border)",
                paddingTop: "12px",
              }}>
                {/* Total */}
                <div style={{
                  flex: 1,
                  paddingRight: "20px",
                  borderRight: "1px solid var(--color-border)",
                }}>
                  <div style={{ fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    Total duration
                  </div>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <DurationStat speed="1x" value={durations.total.speed1x} />
                    <DurationStat speed="1.5x" value={durations.total.speed1_5x} dimmed />
                    <DurationStat speed="2x" value={durations.total.speed2x} dimmed />
                  </div>
                </div>

                {/* Remaining */}
                <div style={{
                  flex: 1,
                  paddingLeft: "20px",
                }}>
                  <div style={{ fontSize: "10px", color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    Time remaining
                  </div>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <DurationStat speed="1x" value={durations.remaining.speed1x} />
                    <DurationStat speed="1.5x" value={durations.remaining.speed1_5x} dimmed />
                    <DurationStat speed="2x" value={durations.remaining.speed2x} dimmed />
                  </div>
                </div>
              </div>
            )}

            {/* Progress */}
            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "12px" }}>
              <ProgressBar percent={path.progressPercent} showLabel height="h-1.5" />
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "6px",
                fontSize: "11px",
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-mono)",
              }}>
                <span>{path.completedVideos} of {path.videos?.length || 0} done</span>
                <span>{path.progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter + Search row ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        marginBottom: "10px",
        flexWrap: "wrap",
      }}>
        {/* Status filter tabs */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "3px",
        }}>
          {filterTabs.map(tab => {
            const isActive = statusFilter === tab.id;
            const isHov = filterHovered === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                onMouseEnter={() => setFilterHovered(tab.id)}
                onMouseLeave={() => setFilterHovered(null)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  fontWeight: isActive ? "600" : "400",
                  color: isActive
                    ? "var(--color-text-primary)"
                    : isHov
                    ? "var(--color-text-secondary)"
                    : "var(--color-text-muted)",
                  background: isActive ? "var(--color-surface-2)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.13s, color 0.13s",
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    color: isActive ? "var(--color-text-secondary)" : "var(--color-text-muted)",
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: "relative", width: "220px" }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{
            position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)",
            color: "var(--color-text-muted)", pointerEvents: "none",
          }}>
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 10px 6px 30px",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              fontSize: "12px",
              color: "var(--color-text-primary)",
              outline: "none",
              fontFamily: "var(--font-sans)",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--color-text-muted)", padding: "2px", display: "flex", alignItems: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Count indicator */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "10px",
        fontSize: "12px",
        color: "var(--color-text-muted)",
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600", color: "var(--color-text-secondary)" }}>
          {filteredVideos.length}
        </span>
        <span style={{ width: "1px", height: "12px", background: "var(--color-border)", display: "inline-block" }} />
        <span>
          {statusFilter === "all" ? "videos" : `${statusFilter} videos`}
          {searchQuery ? ` matching "${searchQuery}"` : ""}
        </span>
      </div>

      {/* ── Video list ── */}
      {filteredVideos.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {filteredVideos.map(video => (
            <VideoRow
              key={video._id}
              video={video}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={searchQuery ? "No videos found" : "No videos here"}
          description={
            searchQuery
              ? `No videos match "${searchQuery}". Try clearing the search.`
              : "Try switching the filter to see all videos."
          }
        />
      )}

      {/* Edit Modal */}
      <EditPathModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        path={path}
        onSave={updatePathDetails}
      />
    </Layout>
  );
}

export default PathDetail;
