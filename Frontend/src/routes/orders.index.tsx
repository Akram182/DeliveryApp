import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { customerService } from "@/lib/services";
import { ProtectedView, requireAuthBeforeLoad } from "@/components/Protected";
import { statusBadgeStyle, statusLabel } from "@/lib/orderStatus";

const search = z.object({
  page: fallback(z.number(), 1).default(1),
  pageSize: fallback(z.number(), 10).default(10),
});

export const Route = createFileRoute("/orders/")({
  validateSearch: zodValidator(search),
  beforeLoad: () => requireAuthBeforeLoad(),
  component: OrdersPage,
});

function OrdersPage() {
  const { page, pageSize } = Route.useSearch();
  const orders = useQuery({
    queryKey: ["orders", page, pageSize],
    queryFn: () => customerService.orders({ page, pageSize }),
  });

  return (
    <ProtectedView>
      <div className="container-wise" style={{ paddingBlock: "32px 64px" }}>
        <h2 style={{ marginBottom: 24 }}>Мои заказы</h2>

        {orders.isLoading && (
          <div className="card-wise" style={{ padding: 32, color: "var(--color-ink-muted)" }}>
            Загружаем…
          </div>
        )}
        {orders.data && orders.data.length === 0 && (
          <div className="card-wise" style={{ padding: 48, textAlign: "center" }}>
            <p style={{ color: "var(--color-ink-muted)", marginBottom: 16 }}>
              Заказов пока нет.
            </p>
            <Link to="/" className="btn btn-primary">
              В каталог
            </Link>
          </div>
        )}
        {orders.data && orders.data.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
            {orders.data.map((o) => (
              <li key={o.id}>
                <Link
                  to="/orders/$id"
                  params={{ id: o.id }}
                  className="card-wise card-wise-hover"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    alignItems: "center",
                    gap: 16,
                    padding: 18,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>Заказ #{o.id.slice(0, 8)}</div>
                    <div style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString("ru-RU")
                        : ""}
                    </div>
                  </div>
                  <span style={statusBadgeStyle(o.status)}>
                    {statusLabel(o.status)}
                  </span>
                  <span className="font-display" style={{ fontSize: "1.5rem", fontWeight: 900 }}>
                    {(o.total ?? 0).toLocaleString("ru-RU")} ₽
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {orders.data && orders.data.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginTop: 24, justifyContent: "center" }}>
            <Link
              to="/orders"
              search={{ page: Math.max(1, page - 1), pageSize }}
              disabled={page <= 1}
              className="btn btn-secondary btn-sm"
              style={{ opacity: page <= 1 ? 0.5 : 1, pointerEvents: page <= 1 ? "none" : "auto" }}
            >
              ← Назад
            </Link>
            <span
              style={{
                padding: "6px 14px",
                fontWeight: 700,
                alignSelf: "center",
              }}
            >
              {page}
            </span>
            <Link
              to="/orders"
              search={{ page: page + 1, pageSize }}
              className="btn btn-secondary btn-sm"
              style={{
                opacity: orders.data.length < pageSize ? 0.5 : 1,
                pointerEvents: orders.data.length < pageSize ? "none" : "auto",
              }}
            >
              Вперёд →
            </Link>
          </div>
        )}
      </div>
    </ProtectedView>
  );
}
