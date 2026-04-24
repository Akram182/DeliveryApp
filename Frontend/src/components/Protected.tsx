import { useEffect, useState, type ReactNode } from "react";
import { redirect } from "@tanstack/react-router";
import { getStoredToken } from "@/lib/api";
import { useAuth } from "@/store/auth";

/**
 * Throw this from `beforeLoad` to gate a route on auth. Works on the client only.
 * SSR pass-through is intentional — UI gating happens in the component below.
 */
export function requireAuthBeforeLoad() {
  if (typeof window !== "undefined" && !getStoredToken()) {
    throw redirect({ to: "/login" });
  }
}

export function requireAdminBeforeLoad() {
  requireAuthBeforeLoad();
  // Role check is async (depends on /me). The component-level gate enforces it.
}

export function ProtectedView({ children }: { children: ReactNode }) {
  const { token, status } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated || status === "loading") {
    return (
      <div className="container-wise" style={{ paddingBlock: 64, color: "var(--color-ink-muted)" }}>
        Загружаем…
      </div>
    );
  }
  if (!token) {
    return (
      <div className="container-wise" style={{ paddingBlock: 64 }}>
        <p style={{ color: "var(--color-ink-muted)" }}>Требуется вход.</p>
      </div>
    );
  }
  return <>{children}</>;
}

export function AdminOnly({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();
  if (status !== "ready") {
    return (
      <div className="container-wise" style={{ paddingBlock: 64, color: "var(--color-ink-muted)" }}>
        Загружаем…
      </div>
    );
  }
  const isAdmin = user?.role === "admin" || user?.role === "Admin";
  if (!isAdmin) {
    return (
      <div className="container-wise" style={{ paddingBlock: 64 }}>
        <h2 style={{ marginBottom: 12 }}>Нет доступа</h2>
        <p style={{ color: "var(--color-ink-muted)" }}>
          Эта страница доступна только администраторам.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}

export function CourierOnly({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();
  if (status !== "ready") {
    return (
      <div className="container-wise" style={{ paddingBlock: 64, color: "var(--color-ink-muted)" }}>
        Загружаем…
      </div>
    );
  }
  const isCourier = user?.role === "courier" || user?.role === "Courier";
  if (!isCourier) {
    return (
      <div className="container-wise" style={{ paddingBlock: 64 }}>
        <h2 style={{ marginBottom: 12 }}>Нет доступа</h2>
        <p style={{ color: "var(--color-ink-muted)" }}>
          Эта страница доступна только курьерам.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
