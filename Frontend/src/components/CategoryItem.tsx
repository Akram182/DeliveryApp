import type { Category } from "@/types/api";
import { resolveImageUrl } from "@/lib/api";

interface Props {
  category: Category;
  active: boolean;
  onSelect: (id: string) => void;
}

export function CategoryItem({ category, active, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(category.id)}
      style={{
        width: "100%",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 16,
        border: "none",
        cursor: "pointer",
        background: active ? "var(--color-mint)" : "transparent",
        color: active ? "var(--color-wise-green-deep)" : "var(--color-ink)",
        transition: "background 160ms ease, transform 160ms ease",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "var(--color-nav-hover)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <span
        aria-hidden
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: "var(--color-surface-soft)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {category.imageUrl ? (
          // TODO: Replace with real image URL from backend
          <img
            src={resolveImageUrl(category.imageUrl)}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 22 }}>🛒</span>
        )}
      </span>
      <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span style={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>
          {category.name}
        </span>
        {category.description && (
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--color-ink-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {category.description}
          </span>
        )}
      </span>
    </button>
  );
}
