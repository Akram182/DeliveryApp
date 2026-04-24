import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/lib/services";
import { ProtectedView, requireAuthBeforeLoad } from "@/components/Protected";

export const Route = createFileRoute("/orders/$id")({
  beforeLoad: () => requireAuthBeforeLoad(),
  component: OrderDetailsPage,
});

function OrderDetailsPage() {
  const { id } = Route.useParams();
  const order = useQuery({
    queryKey: ["order", id],
    queryFn: () => customerService.order(id),
  });

  return (
    <ProtectedView>
      <div className="container-wise" style={{ paddingBlock: "32px 64px" }}>
        <Link to="/orders" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
          ← К списку заказов
        </Link>

        {order.isLoading && (
          <div className="card-wise" style={{ padding: 32, color: "var(--color-ink-muted)" }}>
            Загрузка…
          </div>
        )}
        {order.isError && (
          <div className="card-wise" style={{ padding: 32, color: "var(--color-danger)" }}>
            Не удалось загрузить заказ.
          </div>
        )}
        {order.data && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 24,
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2>Заказ #{order.data.id.slice(0, 8)}</h2>
                <div style={{ marginTop: 6, color: "var(--color-ink-muted)" }}>
                  {order.data.createdAt
                    ? new Date(order.data.createdAt).toLocaleString("ru-RU")
                    : ""}
                </div>
              </div>
              <span className="badge-mint">{order.data.status}</span>
            </div>

            <ul
              className="card-wise"
              style={{ listStyle: "none", padding: 8, margin: 0, display: "grid", gap: 4 }}
            >
              {(order.data.items ?? []).map((it) => (
                <li
                  key={it.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    alignItems: "center",
                    gap: 12,
                    padding: 14,
                    borderRadius: 14,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{it.productName ?? "Товар"}</div>
                  <div style={{ color: "var(--color-ink-muted)" }}>
                    × {it.quantity}
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    {(it.price * it.quantity).toLocaleString("ru-RU")} ₽
                  </div>
                </li>
              ))}
            </ul>

            <div
              className="card-wise"
              style={{
                marginTop: 16,
                padding: 20,
                display: "grid",
                gap: 8,
              }}
            >
              {order.data.deliveryFee != null && order.data.deliveryFee > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-ink-muted)" }}>
                  <span>Доставка</span>
                  <span>{order.data.deliveryFee.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700 }}>Итого</span>
                <span className="font-display" style={{ fontSize: "2rem", fontWeight: 900 }}>
                  {(order.data.total ?? 0).toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedView>
  );
}
