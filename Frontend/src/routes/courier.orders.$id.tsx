import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { courierService } from "@/lib/services";
import { apiErrorMessage } from "@/lib/api";
import type { CourierOrderStatus } from "@/types/api";
import { statusBadgeStyle, statusLabel } from "@/lib/orderStatus";

export const Route = createFileRoute("/courier/orders/$id")({
  component: CourierOrderDetailsPage,
});

// Allowed transitions per business rules
// Created → Pending → PickedUp → InTransit → Delivered ; or Cancelled at any active step
const NEXT_STATUS: Record<string, CourierOrderStatus[]> = {
  created: ["Pending", "Cancelled"],
  pending: ["PickedUp", "Cancelled"],
  pickedup: ["InTransit", "Cancelled"],
  intransit: ["Delivered", "Cancelled"],
  delivered: [],
  cancelled: [],
};

function CourierOrderDetailsPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const order = useQuery({
    queryKey: ["courier", "order", id],
    queryFn: () => courierService.order(id),
  });

  const update = useMutation({
    mutationFn: (status: CourierOrderStatus) =>
      courierService.updateOrderStatus(id, { status }),
    onSuccess: (data) => {
      toast.success(`Статус: ${data.status}`);
      qc.invalidateQueries({ queryKey: ["courier", "order", id] });
      qc.invalidateQueries({ queryKey: ["courier", "orders"] });
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Link to="/courier/orders" className="btn btn-ghost btn-sm" style={{ width: "fit-content" }}>
        ← К списку
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
            className="card-wise"
            style={{ padding: 20, display: "grid", gap: 8 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>
                  Заказ #{order.data.id.slice(0, 8)}
                </div>
                <div style={{ color: "var(--color-ink-muted)", marginTop: 4 }}>
                  {order.data.createdAt
                    ? new Date(order.data.createdAt).toLocaleString("ru-RU")
                    : ""}
                </div>
              </div>
              <span style={statusBadgeStyle(order.data.status)}>{statusLabel(order.data.status)}</span>
            </div>
          </div>

          <div className="card-wise" style={{ padding: 20, display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 700 }}>Действия</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(NEXT_STATUS[order.data.status.toLowerCase()] ?? []).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={
                    s === "Cancelled"
                      ? "btn btn-secondary btn-sm"
                      : "btn btn-primary btn-sm"
                  }
                  disabled={update.isPending}
                  onClick={() => update.mutate(s)}
                >
                  {s}
                </button>
              ))}
              {(NEXT_STATUS[order.data.status.toLowerCase()] ?? []).length === 0 && (
                <span style={{ color: "var(--color-ink-muted)" }}>
                  Нет доступных переходов.
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {(["pickupAddress", "deliveryAddress"] as const).map((k) => {
              const a = order.data?.[k];
              if (!a) return null;
              return (
                <div key={k} className="card-wise" style={{ padding: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>
                    {k === "pickupAddress" ? "Забрать" : "Доставить"}
                  </div>
                  <div style={{ color: "var(--color-ink-muted)", fontSize: 14 }}>
                    {[a.city, a.street, a.building, a.apartament].filter(Boolean).join(", ")}
                  </div>
                  {a.comment && (
                    <div style={{ marginTop: 6, fontSize: 13 }}>
                      💬 {a.comment}
                    </div>
                  )}
                </div>
              );
            })}
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
                <div style={{ color: "var(--color-ink-muted)" }}>× {it.quantity}</div>
                <div style={{ fontWeight: 700 }}>
                  {(it.price * it.quantity).toLocaleString("ru-RU")} ₽
                </div>
              </li>
            ))}
          </ul>

          <div className="card-wise" style={{ padding: 20, display: "grid", gap: 6 }}>
            {order.data.deliveryFee != null && order.data.deliveryFee > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-ink-muted)" }}>
                <span>Доставка</span>
                <span>{order.data.deliveryFee.toLocaleString("ru-RU")} ₽</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700 }}>Итого</span>
              <span className="font-display" style={{ fontSize: "1.5rem", fontWeight: 900 }}>
                {(order.data.total ?? 0).toLocaleString("ru-RU")} ₽
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
