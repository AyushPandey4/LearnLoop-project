import React from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-sans)",
    fontWeight: "500",
    borderRadius: "var(--radius-md)",
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
    opacity: disabled || isLoading ? 0.5 : 1,
    transition: "background 0.15s, border-color 0.15s, color 0.15s, opacity 0.15s",
    border: "1px solid transparent",
    outline: "none",
    gap: "6px",
    whiteSpace: "nowrap",
    textDecoration: "none",
    lineHeight: "1",
  };

  const variants = {
    primary: {
      background: "var(--color-accent)",
      color: "#fff",
      borderColor: "transparent",
    },
    secondary: {
      background: "var(--color-surface-2)",
      color: "var(--color-text-primary)",
      borderColor: "var(--color-border)",
    },
    outline: {
      background: "transparent",
      color: "var(--color-text-primary)",
      borderColor: "var(--color-border)",
    },
    danger: {
      background: "var(--color-error-subtle)",
      color: "var(--color-error)",
      borderColor: "var(--color-error-border)",
    },
    ghost: {
      background: "transparent",
      color: "var(--color-text-secondary)",
      borderColor: "transparent",
    },
  };

  const sizes = {
    sm: { padding: "5px 10px", fontSize: "12px" },
    md: { padding: "7px 14px", fontSize: "13px" },
    lg: { padding: "9px 18px", fontSize: "14px", fontWeight: "600" },
  };

  const hoverMap = {
    primary: { background: "var(--color-accent-hover)" },
    secondary: { background: "var(--color-surface-hover)", borderColor: "var(--color-border-hover)" },
    outline: { background: "var(--color-surface-2)", borderColor: "var(--color-border-hover)" },
    danger: { background: "var(--color-error-subtle)", borderColor: "var(--color-error)" },
    ghost: { background: "var(--color-surface-2)", color: "var(--color-text-primary)" },
  };

  const [hovered, setHovered] = React.useState(false);

  const style = {
    ...base,
    ...variants[variant],
    ...sizes[size],
    ...(hovered && !disabled && !isLoading ? hoverMap[variant] : {}),
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      style={style}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
      {...props}
    >
      {isLoading && (
        <span style={{
          width: "13px",
          height: "13px",
          borderRadius: "50%",
          border: "2px solid currentColor",
          borderTopColor: "transparent",
          animation: "spin 0.7s linear infinite",
          display: "inline-block",
          flexShrink: 0,
        }} />
      )}
      {children}
    </button>
  );
}
