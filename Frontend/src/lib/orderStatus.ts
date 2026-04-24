// Shared helpers for rendering order status with semantic colors.
// Lifecycle: Created → Pending → PickedUp → InTransit → Delivered ; or Cancelled.

export interface StatusStyle {
  color: string;
  bg: string;
  border: string;
  label: string;
}

const PALETTE: Record<string, StatusStyle> = {
  created: {
    color: "#6b5b00",
    bg: "rgba(255, 213, 74, 0.18)",
    border: "rgba(255, 213, 74, 0.55)",
    label: "Создан",
  },
  pending: {
    color: "#7a4a00",
    bg: "rgba(255, 154, 60, 0.18)",
    border: "rgba(255, 154, 60, 0.55)",
    label: "Ожидает",
  },
  pickedup: {
    color: "#0a4a8a",
    bg: "rgba(56, 132, 255, 0.16)",
    border: "rgba(56, 132, 255, 0.5)",
    label: "Забран",
  },
  intransit: {
    color: "#4a1f8a",
    bg: "rgba(140, 82, 255, 0.16)",
    border: "rgba(140, 82, 255, 0.5)",
    label: "В пути",
  },
  delivered: {
    color: "#0e6b3a",
    bg: "rgba(34, 178, 96, 0.18)",
    border: "rgba(34, 178, 96, 0.55)",
    label: "Доставлен",
  },
  cancelled: {
    color: "#8a1a20",
    bg: "rgba(208, 50, 56, 0.14)",
    border: "rgba(208, 50, 56, 0.5)",
    label: "Отменён",
  },
};

const FALLBACK: StatusStyle = {
  color: "var(--color-ink-muted)",
  bg: "rgba(0,0,0,0.05)",
  border: "rgba(0,0,0,0.1)",
  label: "",
};

function key(status: string) {
  return status.toLowerCase().replace(/[\s_-]/g, "");
}

export function statusStyle(status: string): StatusStyle {
  const s = PALETTE[key(status)];
  return s ?? FALLBACK;
}

export function statusBadgeStyle(status: string): React.CSSProperties {
  const s = statusStyle(status);
  return {
    color: s.color,
    background: s.bg,
    border: `1px solid ${s.border}`,
    padding: "4px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap",
  };
}

export function statusLabel(status: string): string {
  return statusStyle(status).label || status;
}
