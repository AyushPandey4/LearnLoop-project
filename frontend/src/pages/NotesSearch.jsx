import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { useSearchNotes } from "../hooks/useSearchNotes";
import { useDebounce } from "../hooks/useDebounce";
import { Badge } from "../components/ui/UIHelpers";
import { VideoRowSkeleton } from "../components/ui/Skeleton";

/* ─── Highlighted text snippet ───────────────────────────────────────────── */
function Highlight({ text, query }) {
  if (!query || !text) return <span>{text}</span>;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            style={{
              background: "rgba(59,130,246,0.2)",
              color: "var(--color-accent-hover)",
              borderRadius: "2px",
              padding: "0 1px",
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

/* ─── Single result card ─────────────────────────────────────────────────── */
function ResultCard({ video, query }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/video/${video._id}`}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "flex",
          gap: "14px",
          padding: "14px",
          background: "var(--color-surface)",
          border: `1px solid ${hovered ? "var(--color-border-hover)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-lg)",
          transition: "border-color 0.15s",
          alignItems: "flex-start",
        }}
      >
        {/* Position Number in front */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            fontWeight: "600",
            color: hovered ? "var(--color-accent-hover)" : "var(--color-text-muted)",
            minWidth: "24px",
            flexShrink: 0,
            textAlign: "center",
            alignSelf: "center",
            transition: "color 0.15s",
          }}
        >
          {video.position + 1}
        </span>

        {/* Thumbnail */}
        {video.thumbnail && (
          <div style={{
            flexShrink: 0,
            width: "130px",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
            aspectRatio: "16/9",
            alignSelf: "center",
          }}>
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "7px" }}>
          {/* Path */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <Badge variant="primary">
              {video.learningPathId?.name || "Learning Path"}
            </Badge>
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: "14px",
            fontWeight: "600",
            color: hovered ? "var(--color-accent-hover)" : "var(--color-text-primary)",
            transition: "color 0.15s",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}>
            {video.title}
          </h3>

          {/* Notes excerpt with highlight */}
          <div style={{
            padding: "9px 11px",
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            fontSize: "12px",
            color: "var(--color-text-secondary)",
            lineHeight: "1.65",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            whiteSpace: "pre-wrap",
          }}>
            <Highlight text={video.notes} query={query} />
          </div>
        </div>

        {/* Arrow */}
        <div style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          alignSelf: "center",
          color: hovered ? "var(--color-accent-hover)" : "var(--color-text-muted)",
          transition: "color 0.15s",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}

/* ─── Notes Search page ──────────────────────────────────────────────────── */
export function NotesSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedQuery = useDebounce(searchTerm, 380);
  const { results, loading, error, search } = useSearchNotes();
  const inputRef = useRef(null);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const hasQuery = debouncedQuery.trim().length > 0;
  const hasResults = results && results.length > 0;

  return (
    <Layout>
      {/* ── Page header ── */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{
          fontSize: "20px",
          fontWeight: "700",
          color: "var(--color-text-primary)",
          letterSpacing: "-0.02em",
          marginBottom: "3px",
        }}>
          Notes Search
        </h1>
        <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
          Search across all notes you have saved on your learning videos.
        </p>
      </div>

      {/* ── Search input ── */}
      <div style={{ maxWidth: "620px", marginBottom: "28px" }}>
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}>
          {/* Search icon */}
          <div style={{
            position: "absolute",
            left: "13px",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
            color: "var(--color-text-muted)",
          }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search keywords in notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 40px 10px 38px",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              fontSize: "14px",
              color: "var(--color-text-primary)",
              outline: "none",
              fontFamily: "var(--font-sans)",
              transition: "border-color 0.15s",
            }}
            onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
            onBlur={e => e.target.style.borderColor = "var(--color-border)"}
          />

          {/* Clear button */}
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(""); inputRef.current?.focus(); }}
              style={{
                position: "absolute",
                right: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "22px",
                height: "22px",
                borderRadius: "var(--radius-sm)",
                background: "var(--color-surface-2)",
                border: "none",
                cursor: "pointer",
                color: "var(--color-text-muted)",
                transition: "background 0.12s, color 0.12s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--color-surface-hover)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--color-surface-2)"; e.currentTarget.style.color = "var(--color-text-muted)"; }}
              title="Clear search"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Hint line */}
        <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "6px" }}>
          Tip: search for concepts, keywords, or code terms from your saved notes.
        </p>
      </div>

      {/* ── Results area ── */}
      <div style={{ maxWidth: "780px" }}>

        {/* Loading state */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <VideoRowSkeleton />
            <VideoRowSkeleton />
            <VideoRowSkeleton />
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div style={{
            padding: "12px 14px",
            background: "var(--color-error-subtle)",
            border: "1px solid var(--color-error-border)",
            borderRadius: "var(--radius-lg)",
            fontSize: "13px",
            color: "var(--color-error)",
          }}>
            {error}
          </div>
        )}

        {/* Results */}
        {!loading && !error && hasQuery && hasResults && (
          <>
            {/* Count */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}>
              <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                {results.length} {results.length === 1 ? "result" : "results"} for{" "}
                <span style={{ color: "var(--color-text-secondary)", fontWeight: "500" }}>
                  "{debouncedQuery}"
                </span>
              </span>
            </div>

            {/* Separator */}
            <div style={{ height: "1px", background: "var(--color-border)", marginBottom: "14px" }} />

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {results.map((video) => (
                <ResultCard key={video._id} video={video} query={debouncedQuery} />
              ))}
            </div>
          </>
        )}

        {/* No results */}
        {!loading && !error && hasQuery && !hasResults && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "56px 32px",
            textAlign: "center",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
          }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "14px",
            }}>
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="var(--color-text-muted)" strokeWidth="1.4"/>
                <path d="M13.5 13.5l4 4" stroke="var(--color-text-muted)" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M5.5 8h5M8 5.5v5" stroke="var(--color-text-muted)" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--color-text-primary)",
              marginBottom: "5px",
            }}>
              No notes matched
            </h3>
            <p style={{
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              maxWidth: "300px",
              lineHeight: "1.6",
            }}>
              No video notes contain "{debouncedQuery}". Try a different keyword.
            </p>
          </div>
        )}

        {/* Idle state — no query yet */}
        {!loading && !error && !hasQuery && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "56px 32px",
            textAlign: "center",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
          }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "14px",
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="7" stroke="var(--color-text-muted)" strokeWidth="1.4"/>
                <path d="M15 15l4 4" stroke="var(--color-text-muted)" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M6 9h6M9 6v6" stroke="var(--color-text-muted)" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--color-text-primary)",
              marginBottom: "5px",
            }}>
              Search your notes
            </h3>
            <p style={{
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              maxWidth: "320px",
              lineHeight: "1.6",
            }}>
              Type a keyword above to search across all your saved video notes.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default NotesSearch;
