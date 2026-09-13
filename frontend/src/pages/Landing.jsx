import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ─── Google icon ─────────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2-9.6-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.4l6.2 5.2C37 38.1 44 33 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

/* ─── Sign in button ──────────────────────────────────────────────────────── */
function SignInButton({ size = "md" }) {
  const [hovered, setHovered] = useState(false);

  const sizes = {
    sm: { padding: "7px 15px", fontSize: "12px", gap: "7px" },
    md: { padding: "9px 20px", fontSize: "13px", gap: "8px" },
    lg: { padding: "12px 24px", fontSize: "14px", gap: "10px" },
  };

  return (
    <button
      onClick={() => { window.location.href = "/api/auth/google"; }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        ...sizes[size],
        background: hovered ? "var(--color-surface-hover)" : "var(--color-surface)",
        border: "1px solid var(--color-border-hover)",
        borderRadius: "var(--radius-md)",
        color: "var(--color-text-primary)",
        fontWeight: "500",
        fontFamily: "var(--font-sans)",
        cursor: "pointer",
        transition: "background 0.13s, border-color 0.13s",
        whiteSpace: "nowrap",
      }}
    >
      <GoogleIcon />
      Sign in with Google
    </button>
  );
}

/* ─── Feature Card ────────────────────────────────────────────────────────── */
function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{
      display: "flex",
      gap: "14px",
      alignItems: "flex-start",
      padding: "20px",
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      transition: "border-color 0.15s, background 0.15s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--color-border-hover)";
        e.currentTarget.style.background = "var(--color-surface-hover)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.background = "var(--color-surface)";
      }}
    >
      <div style={{
        width: "36px",
        height: "36px",
        borderRadius: "var(--radius-md)",
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-text-primary)", marginBottom: "4px" }}>
          {title}
        </div>
        <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
          {desc}
        </div>
      </div>
    </div>
  );
}

/* ─── Interactive Feature Demo 1: Video & Notes Workspace ────────────────── */
function DemoPlayerAndNotes() {
  const [currentTime, setCurrentTime] = useState("08:45");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("1.25x");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [notes, setNotes] = useState(
    `### Dynamic Programming Patterns
[04:12] Optimal substructure: Problem can be broken into overlapping subproblems.
[08:45] Memoization uses top-down recursion with cache dictionary.
[16:20] Tabulation bottom-up array approach saves stack memory.`
  );

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    setSaveStatus("Saving...");
    if (window._saveTimeout) clearTimeout(window._saveTimeout);
    window._saveTimeout = setTimeout(() => {
      setSaveStatus("Saved");
    }, 450);
  };

  const insertTimestamp = () => {
    const timestampStr = `\n[${currentTime}] `;
    setNotes(prev => prev + timestampStr);
    setSaveStatus("Saved");
  };

  return (
    <div className="landing-demo-grid" style={{
      display: "grid",
      gridTemplateColumns: "1fr 1.15fr",
      gap: "20px",
      alignItems: "stretch",
    }}>
      {/* Left: Minimal Video Frame */}
      <div style={{
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Mock Video Canvas */}
        <div style={{
          position: "relative",
          aspectRatio: "16 / 9",
          background: "linear-gradient(135deg, #131722 0%, #1a2336 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          textAlign: "center",
        }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(15, 17, 23, 0.8)",
              border: "1px solid var(--color-border-hover)",
              color: "var(--color-text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.12s, background 0.12s",
              marginBottom: "12px",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1.0)"}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "2px" }}>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--color-text-primary)" }}>
            MIT 6.006: Dynamic Programming & Memoization
          </div>
          <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "3px" }}>
            Clean focus frame · No recommendations · No ads
          </div>

          <div style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "2px 7px",
            background: "rgba(0,0,0,0.6)",
            borderRadius: "var(--radius-sm)",
            fontSize: "10px",
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-secondary)",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isPlaying ? "var(--color-success)" : "var(--color-warning)" }} />
            {isPlaying ? "PLAYING" : "PAUSED"}
          </div>
        </div>

        {/* Video Controls Bar */}
        <div style={{
          padding: "12px 14px",
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-text-primary)", fontWeight: "600" }}>
              {currentTime}
            </span>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-text-muted)" }}>
              / 42:15
            </span>
          </div>

          {/* Scrub line */}
          <div style={{ flex: 1, height: "4px", background: "var(--color-surface-2)", borderRadius: "2px", position: "relative", cursor: "pointer" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              const mins = Math.floor(pct * 42);
              const secs = Math.floor((pct * 42 - mins) * 60);
              setCurrentTime(`${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`);
            }}
          >
            <div style={{ width: "21%", height: "100%", background: "var(--color-accent)", borderRadius: "2px" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {["1x", "1.25x", "1.5x"].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                style={{
                  padding: "2px 6px",
                  fontSize: "10px",
                  fontFamily: "var(--font-mono)",
                  borderRadius: "var(--radius-sm)",
                  background: speed === s ? "var(--color-accent-subtle)" : "transparent",
                  color: speed === s ? "var(--color-accent)" : "var(--color-text-muted)",
                  border: `1px solid ${speed === s ? "var(--color-accent-border)" : "transparent"}`,
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Real Interactive Notes Panel */}
      <div style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Notes Header & Tools */}
        <div style={{
          padding: "10px 14px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text-primary)" }}>
              Video Notes
            </span>
            <span style={{
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              color: saveStatus === "Saving..." ? "var(--color-warning)" : "var(--color-success)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "currentColor" }} />
              {saveStatus}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={insertTimestamp}
              title="Insert current video timestamp"
              style={{
                padding: "3px 8px",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              + [{currentTime}]
            </button>
            <span style={{ fontSize: "11px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
              {notes.length} chars
            </span>
          </div>
        </div>

        {/* Live Note Editor */}
        <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column" }}>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Write notes here... Markdown and timestamps supported."
            style={{
              width: "100%",
              minHeight: "130px",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              lineHeight: "1.6",
            }}
          />

          {/* Clickable Timestamps Quick-jump */}
          <div style={{
            marginTop: "auto",
            paddingTop: "10px",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
          }}>
            <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Jump timestamp:</span>
            {["04:12", "08:45", "16:20"].map((ts) => (
              <button
                key={ts}
                onClick={() => setCurrentTime(ts)}
                style={{
                  padding: "2px 7px",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                  borderRadius: "var(--radius-sm)",
                  background: currentTime === ts ? "var(--color-accent-subtle)" : "var(--color-surface-2)",
                  color: currentTime === ts ? "var(--color-accent)" : "var(--color-text-secondary)",
                  border: `1px solid ${currentTime === ts ? "var(--color-accent-border)" : "var(--color-border)"}`,
                  cursor: "pointer",
                }}
              >
                {ts}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Interactive Feature Demo 2: Instant Global Search ──────────────────── */
function DemoGlobalSearch() {
  const [query, setQuery] = useState("memoization");

  const database = [
    {
      playlist: "Algorithms & Data Structures",
      video: "#4 Dynamic Programming & Memoization",
      time: "08:45",
      snippet: "Memoization uses top-down recursion with cache dictionary to avoid recomputing solved subproblems.",
      tags: ["memoization", "dp", "algorithms"],
    },
    {
      playlist: "Algorithms & Data Structures",
      video: "#6 Shortest Paths & Dijkstra",
      time: "14:10",
      snippet: "Priority queue relaxation loop guarantees O(E + V log V) complexity for non-negative edge weights.",
      tags: ["dijkstra", "graphs", "queue"],
    },
    {
      playlist: "Backend Architecture",
      video: "#11 Database Indexing & B-Trees",
      time: "21:30",
      snippet: "Composite B-tree indexes follow leftmost prefix rule. High selectivity columns must go first.",
      tags: ["indexing", "database", "sql", "b-trees"],
    },
    {
      playlist: "Modern React Internals",
      video: "#3 Fiber Architecture & Reconciliation",
      time: "12:05",
      snippet: "Concurrent rendering splits render work into fiber nodes allowing high-priority user events to interrupt.",
      tags: ["fiber", "react", "concurrent"],
    },
  ];

  const filtered = database.filter(item => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.playlist.toLowerCase().includes(q) ||
      item.video.toLowerCase().includes(q) ||
      item.snippet.toLowerCase().includes(q) ||
      item.tags.some(t => t.includes(q))
    );
  });

  const highlightMatch = (text, q) => {
    if (!q) return text;
    const parts = text.split(new RegExp(`(${q})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} style={{ background: "var(--color-accent-subtle)", color: "var(--color-accent)", padding: "0 2px", borderRadius: "2px" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      padding: "20px",
    }}>
      {/* Search Input Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 14px",
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        marginBottom: "14px",
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search all notes, code concepts, timestamps across every course..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--color-text-primary)",
            fontSize: "13px",
            fontFamily: "var(--font-sans)",
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-text-muted)",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Suggested Quick Queries */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Try searching:</span>
        {["memoization", "indexing", "dijkstra", "fiber"].map((tag) => (
          <button
            key={tag}
            onClick={() => setQuery(tag)}
            style={{
              padding: "2px 8px",
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              background: query === tag ? "var(--color-accent-subtle)" : "var(--color-surface-2)",
              color: query === tag ? "var(--color-accent)" : "var(--color-text-secondary)",
              border: `1px solid ${query === tag ? "var(--color-accent-border)" : "var(--color-border)"}`,
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
            }}
          >
            "{tag}"
          </button>
        ))}
      </div>

      {/* Search Results List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "13px" }}>
            No notes found matching "{query}". Try a different keyword.
          </div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "12px 16px",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}>
                    {item.playlist}
                  </span>
                  <span style={{ color: "var(--color-border)" }}>•</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--color-text-primary)" }}>
                    {item.video}
                  </span>
                </div>
                <span style={{
                  padding: "1px 6px",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--color-text-secondary)",
                }}>
                  {item.time}
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.5", margin: 0 }}>
                {highlightMatch(item.snippet, query)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Interactive Feature Demo 3: Playlist Import & Tracker ──────────────── */
function DemoPlaylistTracker() {
  const [videos, setVideos] = useState([
    { title: "System Architecture Basics: Client-Server & Monoliths", dur: "18:24", status: "Done" },
    { title: "Load Balancing: Round Robin, Least Connections, IP Hash", dur: "24:10", status: "Done" },
    { title: "Database Sharding, Replication & CAP Theorem", dur: "32:45", status: "Watching" },
    { title: "Caching Strategies: Cache-Aside, Write-Through & Eviction", dur: "21:15", status: "Queue" },
    { title: "Message Queues & Event-Driven Microservices", dur: "28:50", status: "Queue" },
  ]);

  const cycleStatus = (index) => {
    setVideos(prev => prev.map((v, i) => {
      if (i !== index) return v;
      const next = v.status === "Queue" ? "Watching" : v.status === "Watching" ? "Done" : "Queue";
      return { ...v, status: next };
    }));
  };

  const doneCount = videos.filter(v => v.status === "Done").length;
  const progressPercent = Math.round((doneCount / videos.length) * 100);

  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      padding: "20px",
    }}>
      {/* Top: Import bar mockup */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "6px 6px 6px 14px",
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        marginBottom: "16px",
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: "var(--color-accent)", flexShrink: 0 }}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{
          flex: 1,
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--color-text-secondary)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          https://youtube.com/playlist?list=PLmX8Fx2qV_9...
        </span>
        <button style={{
          padding: "6px 12px",
          fontSize: "12px",
          fontWeight: "500",
          background: "var(--color-accent-subtle)",
          border: "1px solid var(--color-accent-border)",
          color: "var(--color-accent)",
          borderRadius: "var(--radius-sm)",
          cursor: "default",
          whiteSpace: "nowrap",
        }}>
          Imported
        </button>
      </div>

      {/* Playlist Stats Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-text-primary)" }}>
            Distributed Systems & Backend Engineering
          </div>
          <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
            5 lectures · 2h 05m total · Category: Backend
          </div>
        </div>
        <div style={{
          fontSize: "12px",
          fontFamily: "var(--font-mono)",
          fontWeight: "600",
          color: progressPercent === 100 ? "var(--color-success)" : "var(--color-text-primary)",
        }}>
          {doneCount} / {videos.length} completed ({progressPercent}%)
        </div>
      </div>

      {/* Dynamic Animated Progress Bar */}
      <div style={{ background: "var(--color-surface-2)", height: "6px", borderRadius: "3px", overflow: "hidden", marginBottom: "16px" }}>
        <div style={{
          width: `${progressPercent}%`,
          height: "100%",
          background: progressPercent === 100 ? "var(--color-success)" : "var(--color-accent)",
          borderRadius: "3px",
          transition: "width 0.25s ease-out",
        }} />
      </div>

      {/* Video Row List with Clickable Status Toggles */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {videos.map((vid, idx) => (
          <div
            key={idx}
            onClick={() => cycleStatus(idx)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "9px 12px",
              background: vid.status === "Done" ? "rgba(29, 36, 51, 0.4)" : "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              transition: "border-color 0.12s, background 0.12s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-border-hover)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-border)"}
            title="Click to toggle status (Queue → Watching → Done)"
          >
            <span style={{
              width: "16px",
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              color: "var(--color-text-muted)",
              textAlign: "center",
            }}>
              {idx + 1}
            </span>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: "13px",
                color: vid.status === "Done" ? "var(--color-text-secondary)" : "var(--color-text-primary)",
                textDecoration: vid.status === "Done" ? "line-through" : "none",
              }}>
                {vid.title}
              </div>
            </div>

            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-text-muted)" }}>
              {vid.dur}
            </span>

            <span style={{
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
              fontSize: "10px",
              fontWeight: "600",
              background: vid.status === "Done"
                ? "var(--color-success-subtle)"
                : vid.status === "Watching"
                  ? "var(--color-warning-subtle)"
                  : "transparent",
              color: vid.status === "Done"
                ? "var(--color-success)"
                : vid.status === "Watching"
                  ? "var(--color-warning)"
                  : "var(--color-text-muted)",
              border: `1px solid ${vid.status === "Done" ? "rgba(52,211,153,0.3)" : vid.status === "Watching" ? "rgba(245,158,11,0.3)" : "var(--color-border)"}`,
              userSelect: "none",
            }}>
              {vid.status}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "12px", fontSize: "11px", color: "var(--color-text-muted)", textAlign: "right" }}>
        Tip: Click any video row to toggle status between Queue, Watching, and Done
      </div>
    </div>
  );
}

/* ─── Landing Page ────────────────────────────────────────────────────────── */
export function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("player");

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  if (loading) return null;

  const coreFeatures = [
    {
      title: "Distraction-Free Video Player",
      desc: "Strips out YouTube algorithm recommendations, sidebar clickbait, and comment sections so you focus entirely on the lesson.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="var(--color-accent)" strokeWidth="1.6" />
          <path d="M10 9l5 3-5 3V9z" fill="var(--color-accent)" />
        </svg>
      ),
    },
    {
      title: "Real-time Autosaving Notes",
      desc: "Type notes with full Markdown syntax directly next to the video. Everything persists across sessions without manual saving.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 4h16v16H4V4z" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M8 8h8M8 12h8M8 16h4" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "One-Click Timestamp Linking",
      desc: "Insert the current video time into your notes with a single shortcut. Click any timestamp to jump straight back to that explanation.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="var(--color-accent)" strokeWidth="1.6" />
          <path d="M12 7v5l3 2" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Instant Global Note Search",
      desc: "Search every concept, code snippet, and timestamp you've ever typed across all playlists and videos simultaneously in milliseconds.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="var(--color-accent)" strokeWidth="1.6" />
          <path d="M16 16l4.5 4.5" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Structured Progress Tracking",
      desc: "Mark videos as Queue, In Progress, or Completed. Track path percentages and pick up right where you stopped.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 11l3 3L22 4" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Custom Category Organization",
      desc: "Group playlists into distinct tracks like Frontend, Distributed Systems, AI, or Mathematics with dedicated filter chips.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h10M4 17h6" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--color-bg)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--font-sans)",
      color: "var(--color-text-primary)",
      scrollBehavior: "smooth",
    }}>
      <style>{`
        @media (max-width: 960px) {
          .landing-hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .landing-features-grid { grid-template-columns: 1fr !important; }
          .landing-demo-grid { grid-template-columns: 1fr !important; }
          .landing-screen-section { min-height: auto !important; padding: 48px 16px !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg)",
      }}>
        <div style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "0 24px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
            }}>
              LearnLoop
            </span>
          </div>

          {/* Nav right */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <a
                href="#demo"
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.13s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-primary)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-secondary)"}
              >
                Live Demo
              </a>
              <a
                href="#features"
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.13s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-primary)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-secondary)"}
              >
                Features
              </a>
              <Link
                to="/terms"
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.13s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-primary)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-secondary)"}
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.13s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-primary)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-secondary)"}
              >
                Privacy
              </Link>
            </nav>
            <SignInButton size="sm" />
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main style={{ flex: 1 }}>

        {/* ── Hero Section (Screen 1) ── */}
        <section className="landing-screen-section" style={{
          minHeight: "calc(100vh - 56px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          boxSizing: "border-box",
          scrollSnapAlign: "start",
        }}>
          <div className="landing-hero-grid" style={{
            maxWidth: "1120px",
            width: "100%",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "56px",
            alignItems: "center",
          }}>
            {/* Left Column */}
            <div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "4px 10px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                fontSize: "11px",
                fontWeight: "500",
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-mono)",
                marginBottom: "20px",
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-success)", display: "inline-block" }} />
                Open Learning Workspace
              </div>

              <h1 style={{
                fontSize: "42px",
                fontWeight: "700",
                color: "var(--color-text-primary)",
                lineHeight: "1.2",
                letterSpacing: "-0.03em",
                marginBottom: "18px",
              }}>
                Your YouTube playlists,{" "}
                <span style={{ color: "var(--color-accent)" }}>turned into structured learning paths.</span>
              </h1>

              <p style={{
                fontSize: "15px",
                color: "var(--color-text-secondary)",
                lineHeight: "1.7",
                marginBottom: "28px",
                maxWidth: "460px",
              }}>
                Import educational courses, watch in a distraction-free player, write timestamped notes that auto-save, and search your entire personal knowledge base.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <SignInButton size="lg" />
                <a
                  href="#demo"
                  style={{
                    fontSize: "13px",
                    color: "var(--color-text-secondary)",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "color 0.13s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-primary)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-secondary)"}
                >
                  Try interactive demo ↓
                </a>
              </div>
            </div>

            {/* Right Column: Mini Hero Course Preview Card */}
            <div>
              <div style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.5)",
              }}>
                {/* Card Header */}
                <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--color-border)" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--color-border)" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--color-border)" }} />
                    <span style={{ fontSize: "11px", color: "var(--color-text-muted)", marginLeft: "4px", fontFamily: "var(--font-mono)" }}>learnloop / workspace</span>
                  </div>
                  <span style={{
                    padding: "2px 7px",
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    background: "var(--color-accent-subtle)",
                    color: "var(--color-accent)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-accent-border)",
                  }}>
                    CS Fundamentals
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: "18px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-text-primary)" }}>
                        Computer Science: Data Structures
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
                        8 of 12 lectures completed · 66%
                      </div>
                    </div>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "var(--color-success)",
                      background: "var(--color-success-subtle)",
                      border: "1px solid rgba(52,211,153,0.25)",
                      padding: "3px 8px",
                      borderRadius: "var(--radius-sm)",
                    }}>
                      Active
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ background: "var(--color-surface-2)", borderRadius: "3px", height: "5px", marginBottom: "16px", overflow: "hidden" }}>
                    <div style={{ width: "66%", height: "100%", background: "var(--color-success)", borderRadius: "3px" }} />
                  </div>

                  {/* Video items */}
                  {[
                    { title: "Binary Search Trees & Balancing", status: "Done", tag: "24m" },
                    { title: "Red-Black Trees & Rotations", status: "Done", tag: "31m" },
                    { title: "Graph Traversals: DFS vs BFS", status: "Watching", tag: "28m", active: true },
                    { title: "Topological Sort & DAGs", status: "Queue", tag: "19m" },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "7px 0",
                      borderBottom: i < 3 ? "1px solid var(--color-border)" : "none",
                      opacity: row.status === "Done" ? 0.65 : 1,
                    }}>
                      <span style={{
                        fontSize: "11px",
                        fontFamily: "var(--font-mono)",
                        color: "var(--color-text-muted)",
                        width: "14px",
                      }}>{i + 1}</span>
                      <div style={{ flex: 1, fontSize: "12px", color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {row.title}
                      </div>
                      <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-text-muted)" }}>
                        {row.tag}
                      </span>
                      <span style={{
                        padding: "1px 6px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "9px",
                        fontWeight: "600",
                        background: row.status === "Done"
                          ? "var(--color-success-subtle)"
                          : row.status === "Watching"
                            ? "var(--color-warning-subtle)"
                            : "transparent",
                        color: row.status === "Done"
                          ? "var(--color-success)"
                          : row.status === "Watching"
                            ? "var(--color-warning)"
                            : "var(--color-text-muted)",
                        border: `1px solid ${row.status === "Done" ? "rgba(52,211,153,0.25)" : row.status === "Watching" ? "rgba(245,158,11,0.3)" : "transparent"}`,
                      }}>
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Interactive Feature Demo Section (Screen 2) ── */}
        <section id="demo" className="landing-screen-section" style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderTop: "1px solid var(--color-border)",
          backgroundColor: "rgba(23, 28, 38, 0.4)",
          padding: "64px 24px",
          boxSizing: "border-box",
          scrollSnapAlign: "start",
        }}>
          <div style={{ maxWidth: "1120px", width: "100%", margin: "0 auto" }}>
            {/* Section Header */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
              <div>
                <div style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--color-accent)",
                  marginBottom: "6px",
                  fontFamily: "var(--font-mono)",
                }}>
                  Interactive Demonstration
                </div>
                <h2 style={{
                  fontSize: "26px",
                  fontWeight: "700",
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.02em",
                }}>
                  See how each feature actually works
                </h2>
              </div>

              {/* Demo Tabs */}
              <div style={{
                display: "inline-flex",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "3px",
                gap: "4px",
              }}>
                {[
                  { id: "player", label: "Player & Notes" },
                  { id: "search", label: "Global Note Search" },
                  { id: "syllabus", label: "Playlist Tracker" },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: "500",
                      fontFamily: "var(--font-sans)",
                      borderRadius: "var(--radius-sm)",
                      border: "none",
                      background: activeTab === tab.id ? "var(--color-surface-2)" : "transparent",
                      color: activeTab === tab.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                      cursor: "pointer",
                      transition: "all 0.12s",
                      boxShadow: activeTab === tab.id ? "0 1px 2px rgba(0,0,0,0.2)" : "none",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Views */}
            {activeTab === "player" && <DemoPlayerAndNotes />}
            {activeTab === "search" && <DemoGlobalSearch />}
            {activeTab === "syllabus" && <DemoPlaylistTracker />}
          </div>
        </section>

        {/* ── Pure Features Specifications Grid (Screen 3) ── */}
        <section id="features" className="landing-screen-section" style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderTop: "1px solid var(--color-border)",
          padding: "64px 24px",
          boxSizing: "border-box",
          scrollSnapAlign: "start",
        }}>
          <div style={{ maxWidth: "1120px", width: "100%", margin: "0 auto" }}>
            <div style={{ marginBottom: "40px" }}>
              <div style={{
                fontSize: "11px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--color-accent)",
                marginBottom: "6px",
                fontFamily: "var(--font-mono)",
              }}>
                Feature Breakdown
              </div>
              <h2 style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "var(--color-text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: "8px",
              }}>
                Built purely for disciplined self-learning
              </h2>
              <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.6", maxWidth: "520px" }}>
                Everything is engineered to help you finish long technical courses without YouTube's algorithmic distractions.
              </p>
            </div>

            <div className="landing-features-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
            }}>
              {coreFeatures.map((f, i) => (
                <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} />
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer (Clean, minimal, no unnecessary CTA section) ── */}
      <footer style={{
        borderTop: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface)",
        padding: "24px",
      }}>
        <div style={{
          maxWidth: "1120px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src="/learnloop_logo.png"
              alt="LearnLoop Logo"
              style={{
                width: "20px",
                height: "20px",
                objectFit: "contain",
                borderRadius: "3px",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text-secondary)" }}>
              LearnLoop
            </span>
            <span style={{ width: "1px", height: "12px", background: "var(--color-border)", display: "inline-block", margin: "0 4px" }} />
            <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
              {new Date().getFullYear()}
            </span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a
              href="#demo"
              style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
                textDecoration: "none",
                transition: "color 0.13s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}
            >
              Demo
            </a>
            <a
              href="#features"
              style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
                textDecoration: "none",
                transition: "color 0.13s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}
            >
              Features
            </a>
            <Link
              to="/terms"
              style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
                textDecoration: "none",
                transition: "color 0.13s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
                textDecoration: "none",
                transition: "color 0.13s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
