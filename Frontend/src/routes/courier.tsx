import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import {
  CourierOnly,
  ProtectedView,
  requireAuthBeforeLoad,
} from "@/components/Protected";

export const Route = createFileRoute("/courier")({
  beforeLoad: () => requireAuthBeforeLoad(),
  component: CourierLayout,
});

function CourierLayout() {
  const loc = useLocation();
  const tabs = [
    { to: "/courier", label: "Профиль" },
    { to: "/courier/orders", label: "Заказы" },
    { to: "/courier/earnings", label: "Заработок" },
  ];
  return (
    <ProtectedView>
      <CourierOnly>
        <div className="container-wise" style={{ paddingBlock: "32px 64px" }}>
          <h2 style={{ marginBottom: 24 }}>Курьер</h2>
          <div
            role="tablist"
            style={{
              display: "flex",
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
              const active =
                t.to === "/courier"
                  ? loc.pathname === "/courier"
                  : loc.pathname.startsWith(t.to);
              return (
                <Link
                  key={t.to}
                  to={t.to}
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
          <Outlet />
        </div>
      </CourierOnly>
    </ProtectedView>
  );
}
