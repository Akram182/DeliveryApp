import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface Tab {
  to: string;
  label: string;
}

export function ProfileTabs({ tabs }: { tabs: Tab[] }) {
  const loc = useLocation();
  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        padding: 6,
        borderRadius: 9999,
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-ring)",
        marginBottom: 24,
        width: "fit-content",
      }}
    >
      {tabs.map((t) => {
        const active = loc.pathname === t.to || loc.pathname.startsWith(t.to + "/");
        return (
          <Link
            key={t.to}
            to={t.to}
            role="tab"
            aria-selected={active}
            className="btn btn-sm"
            style={{
              background: active ? "var(--color-ink)" : "transparent",
              color: active ? "#fff" : "var(--color-ink)",
            }}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}

export function ProfileShell({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="card-wise" style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ fontSize: "1.5rem" }}>{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}
