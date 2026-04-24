export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display ${className}`}
      style={{
        fontWeight: 900,
        fontSize: "1.75rem",
        lineHeight: 0.85,
        letterSpacing: "-0.02em",
        color: "var(--color-ink)",
      }}
    >
      fresh<span style={{ color: "var(--color-wise-green-deep)" }}>.</span>
      <span
        style={{
          background: "var(--color-wise-green)",
          color: "var(--color-wise-green-deep)",
          padding: "0 8px",
          borderRadius: "9999px",
          marginLeft: "4px",
          display: "inline-block",
        }}
      >
        go
      </span>
    </span>
  );
}
