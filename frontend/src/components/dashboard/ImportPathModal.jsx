import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useCategories } from "../../hooks/useCategories";

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  background: "var(--color-bg)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  fontSize: "13px",
  color: "var(--color-text-primary)",
  outline: "none",
  transition: "border-color 0.15s",
  fontFamily: "var(--font-sans)",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "600",
  color: "var(--color-text-secondary)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: "6px",
};

const hintStyle = {
  fontSize: "11px",
  color: "var(--color-text-muted)",
  marginTop: "5px",
  lineHeight: "1.5",
};

export function ImportPathModal({ isOpen, onClose, onImport, categories = [] }) {
  const { categories: hookCategories } = useCategories();
  const rawList = categories && categories.length > 0 ? categories : hookCategories;
  const categoryList = Array.from(new Set(["All", ...(rawList || []).filter(Boolean)]));

  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("All");
  const [urlEmptyError, setUrlEmptyError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setUrl("");
      setName("");
      setCategory(categoryList[0] || "All");
      setUrlEmptyError(false);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setUrlEmptyError(true);
      return;
    }
    setUrlEmptyError(false);
    setLoading(true);
    setError(null);
    try {
      await onImport(url.trim(), name.trim(), category);
      setUrl("");
      setName("");
      setCategory("All");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to import playlist. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "var(--color-accent)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "var(--color-border)";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import YouTube Playlist">
      <form onSubmit={handleSubmit} noValidate>
        {/* Error banner */}
        {error && (
          <div style={{
            marginBottom: "16px",
            padding: "10px 12px",
            background: "var(--color-error-subtle)",
            border: "1px solid var(--color-error-border)",
            borderRadius: "var(--radius-md)",
            fontSize: "13px",
            color: "var(--color-error)",
            lineHeight: "1.4",
          }}>
            {error}
          </div>
        )}

        {/* URL Input */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Playlist URL *</label>
          <input
            type="text"
            placeholder="https://www.youtube.com/playlist?list=PL..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (urlEmptyError && e.target.value.trim()) setUrlEmptyError(false);
            }}
            onFocus={(e) => {
              e.target.style.borderColor = urlEmptyError ? "var(--color-error)" : "var(--color-accent)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = urlEmptyError ? "var(--color-error)" : "var(--color-border)";
            }}
            style={{
              ...inputStyle,
              borderColor: urlEmptyError ? "var(--color-error)" : "var(--color-border)",
            }}
          />
          {urlEmptyError ? (
            <p style={{
              fontSize: "12px",
              color: "var(--color-error)",
              marginTop: "5px",
              marginLeft: "2px",
              lineHeight: "1.4",
            }}>
              Please enter a YouTube playlist URL.
            </p>
          ) : (
            <p style={hintStyle}>Paste any public YouTube playlist link. All videos will be imported.</p>
          )}
        </div>

        {/* Custom Title (optional) */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Title (optional)</label>
          <input
            type="text"
            placeholder="Leave blank to use the playlist title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={inputStyle}
          />
        </div>

        {/* Category Dropdown (Select existing categories only) */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Category</label>
          <div style={{ position: "relative" }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={{
                ...inputStyle,
                cursor: "pointer",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238896a8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                backgroundSize: "14px",
                paddingRight: "36px",
              }}
            >
              {categoryList.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  style={{
                    background: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <p style={hintStyle}>Choose an existing category to organize this playlist into.</p>
        </div>

        {/* Actions */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          paddingTop: "16px",
          borderTop: "1px solid var(--color-border)",
        }}>
          <Button variant="ghost" onClick={onClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Import Path
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ImportPathModal;
