import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useCategories } from "../../hooks/useCategories";

/* ─── Shared field styles ─────────────────────────────────────────────────── */
const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  background: "var(--color-bg)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  fontSize: "13px",
  color: "var(--color-text-primary)",
  fontFamily: "var(--font-sans)",
  outline: "none",
  transition: "border-color 0.13s",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "600",
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "6px",
};

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export function EditPathModal({ isOpen, onClose, path, onSave }) {
  const { categories } = useCategories();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("All");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categoryList = Array.from(new Set(["All", ...(categories || []), ...(path?.category ? [path.category] : [])]));

  useEffect(() => {
    if (path) {
      setName(path.name || "");
      setDescription(path.description || "");
      setCategory(path.category || "All");
    }
  }, [path]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError("Path name is required"); return; }
    if (!category.trim()) { setError("Category is required"); return; }

    setLoading(true);
    setError(null);

    try {
      await onSave({ name: name.trim(), category: category.trim(), description: description.trim() });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update learning path");
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; };
  const blurStyle  = (e) => { e.currentTarget.style.borderColor = "var(--color-border)"; };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Learning Path">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* Error banner */}
        {error && (
          <div style={{
            padding: "10px 14px",
            background: "var(--color-error-subtle)",
            border: "1px solid var(--color-error-border)",
            borderRadius: "var(--radius-md)",
            fontSize: "12px",
            color: "var(--color-error)",
            lineHeight: "1.5",
          }}>
            {error}
          </div>
        )}

        {/* Path Title */}
        <Field label="Path Title *">
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. React from Zero to Hero"
            style={inputStyle}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </Field>

        {/* Category */}
        <Field label="Category *">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              ...inputStyle,
              cursor: "pointer",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%235a6680' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              paddingRight: "32px",
            }}
            onFocus={focusStyle}
            onBlur={blurStyle}
          >
            {categoryList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Optional — a short note about this learning path"
            style={{ ...inputStyle, resize: "none", lineHeight: "1.6" }}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </Field>

        {/* Footer actions */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          paddingTop: "4px",
          borderTop: "1px solid var(--color-border)",
          marginTop: "2px",
        }}>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}


