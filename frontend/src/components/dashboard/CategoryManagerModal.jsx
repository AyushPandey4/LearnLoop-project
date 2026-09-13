import React, { useState, useMemo } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";

const inputStyle = {
  flex: 1,
  padding: "7px 12px",
  background: "var(--color-bg)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  fontSize: "13px",
  color: "var(--color-text-primary)",
  outline: "none",
  fontFamily: "var(--font-sans)",
  transition: "border-color 0.15s",
};

export function CategoryManagerModal({ isOpen, onClose, categories, onAdd, onRename, onDelete }) {
  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [error, setError] = useState(null);
  const [emptyError, setEmptyError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Category delete confirmation state
  const [catToDelete, setCatToDelete] = useState(null);
  const [isDeletingCat, setIsDeletingCat] = useState(false);
  const [deleteCatError, setDeleteCatError] = useState(null);

  const displayList = useMemo(() => {
    return Array.from(new Set(["All", ...(categories || []).filter(Boolean)]));
  }, [categories]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setEmptyError(true);
      return;
    }
    if (newCatName.trim().toLowerCase() === "all") {
      setError("Category 'All' is already the default central category");
      return;
    }
    setEmptyError(false);
    setLoading(true);
    setError(null);
    try {
      await onAdd(newCatName.trim());
      setNewCatName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRename = async (oldName) => {
    if (!editingValue.trim() || editingValue.trim() === oldName) {
      setEditingCat(null);
      return;
    }
    if (oldName === "All") {
      setEditingCat(null);
      return;
    }
    if (editingValue.trim().toLowerCase() === "all") {
      setError("Cannot rename a category to 'All'");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onRename(oldName, editingValue.trim());
      setEditingCat(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDelete = (name) => {
    if (name === "All") return;
    setCatToDelete(name);
    setDeleteCatError(null);
  };

  const handleConfirmDelete = async () => {
    if (!catToDelete || catToDelete === "All") return;
    setIsDeletingCat(true);
    setDeleteCatError(null);
    try {
      await onDelete(catToDelete);
      setCatToDelete(null);
    } catch (err) {
      setDeleteCatError(err.message || "Failed to delete category.");
    } finally {
      setIsDeletingCat(false);
    }
  };

  const handleClose = () => {
    setEmptyError(false);
    setNewCatName("");
    setEditingCat(null);
    setError(null);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Manage Categories">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Error */}
          {error && (
            <div style={{
              padding: "10px 12px",
              background: "var(--color-error-subtle)",
              border: "1px solid var(--color-error-border)",
              borderRadius: "var(--radius-md)",
              fontSize: "12px",
              color: "var(--color-error)",
            }}>
              {error}
            </div>
          )}

          {/* Add form */}
          <div>
            <form onSubmit={handleAdd} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="New category name"
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  if (emptyError && e.target.value.trim()) setEmptyError(false);
                }}
                onFocus={e => e.target.style.borderColor = emptyError ? "var(--color-error)" : "var(--color-accent)"}
                onBlur={e => e.target.style.borderColor = emptyError ? "var(--color-error)" : "var(--color-border)"}
                style={{
                  ...inputStyle,
                  borderColor: emptyError ? "var(--color-error)" : "var(--color-border)",
                }}
              />
              <Button type="submit" variant="primary" size="sm" isLoading={loading}>
                Add
              </Button>
            </form>
            {emptyError && (
              <p style={{
                fontSize: "12px",
                color: "var(--color-error)",
                marginTop: "6px",
                marginLeft: "2px",
                lineHeight: "1.4",
              }}>
                Please enter a category name.
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--color-border)" }} />

          {/* Category list */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            maxHeight: "260px",
            overflowY: "auto",
          }}>
            {displayList.length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--color-text-muted)", textAlign: "center", padding: "20px 0" }}>
                No categories yet.
              </p>
            ) : (
              displayList.map((cat) => (
                <div
                  key={cat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 12px",
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    gap: "8px",
                  }}
                >
                  {editingCat === cat ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
                        onBlur={e => e.target.style.borderColor = "var(--color-border)"}
                        style={{ ...inputStyle, flex: 1, fontSize: "12px", padding: "4px 8px" }}
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === "Enter") { e.preventDefault(); handleSaveRename(cat); }
                          if (e.key === "Escape") setEditingCat(null);
                        }}
                      />
                      <button
                        onClick={() => handleSaveRename(cat)}
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "var(--color-success)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px 4px",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCat(null)}
                        style={{
                          fontSize: "12px",
                          color: "var(--color-text-muted)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px 4px",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "var(--color-text-primary)",
                        flex: 1,
                      }}>
                        {cat}
                      </span>
                      {cat === "All" ? (
                        <span style={{
                          fontSize: "11px",
                          fontWeight: "500",
                          color: "var(--color-text-muted)",
                          background: "var(--color-surface-3, rgba(255,255,255,0.06))",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--color-border)",
                        }}>
                          Default
                        </span>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <button
                            onClick={() => { setEditingCat(cat); setEditingValue(cat); }}
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-secondary)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "2px 0",
                              transition: "color 0.12s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = "var(--color-accent-hover)"}
                            onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-secondary)"}
                          >
                            Rename
                          </button>
                          <button
                            onClick={() => handleOpenDelete(cat)}
                            title={`Delete "${cat}"`}
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-muted)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "2px 0",
                              transition: "color 0.12s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = "var(--color-error)"}
                            onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog for Category Deletion */}
      <ConfirmDialog
        isOpen={Boolean(catToDelete)}
        onClose={() => {
          if (!isDeletingCat) {
            setCatToDelete(null);
            setDeleteCatError(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        itemTitle={catToDelete}
        description="Are you sure you want to delete this category? Any learning paths currently assigned to this category will be moved to 'All'."
        confirmText="Delete Category"
        cancelText="Cancel"
        loadingText="Deleting..."
        variant="danger"
        isLoading={isDeletingCat}
        error={deleteCatError}
      />
    </>
  );
}

export default CategoryManagerModal;
