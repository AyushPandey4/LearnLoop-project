import React, { useState, useMemo } from "react";
import { Layout } from "../components/layout/Layout";
import { usePaths } from "../hooks/usePaths";
import { useCategories } from "../hooks/useCategories";
import { ContinueLearningCard } from "../components/dashboard/ContinueLearningCard";
import { PathCard } from "../components/dashboard/PathCard";
import { ImportPathModal } from "../components/dashboard/ImportPathModal";
import { CategoryManagerModal } from "../components/dashboard/CategoryManagerModal";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/UIHelpers";
import { PathCardSkeleton } from "../components/ui/Skeleton";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

/* ─── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      padding: "16px 18px",
    }}>
      <div style={{
        fontSize: "22px",
        fontWeight: "700",
        color: accent || "var(--color-text-primary)",
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
        marginBottom: "5px",
      }}>
        {value}
      </div>
      <div style={{
        fontSize: "12px",
        color: "var(--color-text-muted)",
        fontWeight: "500",
      }}>
        {label}
      </div>
    </div>
  );
}

/* ─── Category pill ─────────────────────────────────────────────────────── */
function CategoryPill({ label, active, onClick }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "5px 12px",
        borderRadius: "var(--radius-md)",
        fontSize: "12px",
        fontWeight: active ? "600" : "500",
        cursor: "pointer",
        whiteSpace: "nowrap",
        border: active
          ? "1px solid var(--color-accent-border)"
          : "1px solid var(--color-border)",
        background: active
          ? "var(--color-accent-subtle)"
          : hovered
          ? "var(--color-surface-2)"
          : "transparent",
        color: active
          ? "var(--color-accent-hover)"
          : hovered
          ? "var(--color-text-primary)"
          : "var(--color-text-secondary)",
        transition: "background 0.12s, color 0.12s, border-color 0.12s",
      }}
    >
      {label}
    </button>
  );
}

/* ─── Dashboard ─────────────────────────────────────────────────────────── */
export function Dashboard() {
  const { paths, overallStats, continueData, loading, error, refresh, importPath, deletePath } = usePaths();
  const { categories, refresh: refreshCategories, addCategory, renameCategory, deleteCategory } = useCategories();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [pathToDelete, setPathToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const allCategories = useMemo(() => {
    const set = new Set(["All", ...(categories || [])]);
    if (paths) {
      paths.forEach((p) => {
        if (p.category) set.add(p.category);
      });
    }
    return Array.from(set);
  }, [categories, paths]);

  const filteredPaths = useMemo(() => {
    if (selectedCategory === "All") return paths;
    return (paths || []).filter((p) => p.category === selectedCategory);
  }, [paths, selectedCategory]);

  const handleOpenDeleteDialog = (id, name) => {
    setPathToDelete({ id, name });
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!pathToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deletePath(pathToDelete.id);
      setPathToDelete(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to remove learning path.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCategoryChange = async () => {
    await refresh();
    await refreshCategories();
  };

  return (
    <Layout>
      {/* ── Page header ── */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "28px",
        gap: "16px",
        flexWrap: "wrap",
      }}>
        <div>
          <h1 style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "var(--color-text-primary)",
            marginBottom: "3px",
            letterSpacing: "-0.02em",
          }}>
            Learning Workspace
          </h1>
          <p style={{
            fontSize: "13px",
            color: "var(--color-text-muted)",
          }}>
            Track your progress across all learning paths.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsCatModalOpen(true)}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 3.5h10M1.5 6.5h7M1.5 9.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Categories
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1.5v8M3 7l3.5 3.5L10 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1.5 11.5h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Import Playlist
          </Button>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div>
          {/* Skeleton stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "12px",
            marginBottom: "28px",
          }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                height: "70px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
              }} className="animate-skeleton" />
            ))}
          </div>

          {/* Skeleton grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <PathCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div style={{
          padding: "14px 16px",
          background: "var(--color-error-subtle)",
          border: "1px solid var(--color-error-border)",
          borderRadius: "var(--radius-lg)",
          fontSize: "13px",
          color: "var(--color-error)",
        }}>
          {error}
        </div>
      ) : (
        <>
          {/* ── Continue Learning ── */}
          <ContinueLearningCard continueData={continueData} />

          {/* ── Stats row ── */}
          {overallStats && overallStats.totalPaths > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "12px",
              marginBottom: "28px",
            }}>
              <StatCard label="Learning Paths" value={overallStats.totalPaths} />
              <StatCard
                label="Overall Progress"
                value={`${overallStats.overallProgressPercent}%`}
                accent="var(--color-accent-hover)"
              />
              <StatCard
                label="Videos Completed"
                value={overallStats.completedVideos}
                accent="var(--color-success)"
              />
              <StatCard
                label="Total Videos"
                value={overallStats.totalVideos}
              />
            </div>
          )}

          {/* ── Section header: filters + count ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
            gap: "12px",
            flexWrap: "wrap",
          }}>
            {/* Category pills */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              overflowX: "auto",
              flexShrink: 1,
            }} className="scrollbar-none">
              {allCategories.map((cat) => (
                <CategoryPill
                  key={cat}
                  label={cat}
                  active={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                />
              ))}
            </div>

            {/* Count label */}
            {filteredPaths && filteredPaths.length > 0 && (
              <span style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
                flexShrink: 0,
              }}>
                {filteredPaths.length} {filteredPaths.length === 1 ? "path" : "paths"}
              </span>
            )}
          </div>

          {/* ── Separator ── */}
          <div style={{
            height: "1px",
            background: "var(--color-border)",
            marginBottom: "20px",
          }} />

          {/* ── Grid or empty state ── */}
          {filteredPaths && filteredPaths.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}>
              {filteredPaths.map((path) => (
                <PathCard key={path._id} path={path} onDelete={handleOpenDeleteDialog} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={selectedCategory === "All" ? "No learning paths yet" : `No paths in "${selectedCategory}"`}
              description={
                selectedCategory === "All"
                  ? "Import a YouTube playlist to start tracking your learning journey."
                  : "Try switching to a different category or import a new playlist."
              }
              action={
                selectedCategory === "All" ? (
                  <Button variant="primary" size="md" onClick={() => setIsImportModalOpen(true)}>
                    Import Playlist
                  </Button>
                ) : null
              }
            />
          )}
        </>
      )}

      {/* ── Modals ── */}
      <ImportPathModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={importPath}
        categories={categories}
      />

      <CategoryManagerModal
        isOpen={isCatModalOpen}
        onClose={() => {
          setIsCatModalOpen(false);
          handleCategoryChange();
        }}
        categories={categories}
        onAdd={addCategory}
        onRename={renameCategory}
        onDelete={deleteCategory}
      />

      {/* ── Remove Path Confirmation Dialog ── */}
      <ConfirmDialog
        isOpen={Boolean(pathToDelete)}
        onClose={() => {
          if (!isDeleting) {
            setPathToDelete(null);
            setDeleteError(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Remove Learning Path"
        itemTitle={pathToDelete?.name}
        description="Are you sure you want to remove this learning path from your workspace?"
        confirmText="Remove Path"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        error={deleteError}
      />
    </Layout>
  );
}

export default Dashboard;
