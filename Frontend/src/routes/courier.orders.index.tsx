import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { courierService } from "@/lib/services";
import { apiErrorMessage } from "@/lib/api";
import { statusBadgeStyle, statusLabel } from "@/lib/orderStatus";

export const Route = createFileRoute("/courier/orders/")({
  component: CourierOrdersPage,
});

function CourierOrdersPage() {
  const qc = useQueryClient();
  const orders = useQuery({
    queryKey: ["courier", "orders"],
    queryFn: () => courierService.orders({ page: 1, pageSize: 50 }),
  });

  const accept = useMutation({
    mutationFn: (id: string) => courierService.acceptOrder(id),
    onSuccess: () => {
      toast.success("Заказ принят");
      qc.invalidateQueries({ queryKey: ["courier", "orders"] });
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {orders.isLoading && (
        <div className="card-wise" style={{ padding: 24, color: "var(--color-ink-muted)" }}>
          Загрузка…
        </div>
      )}
      {orders.isError && (
        <div className="card-wise" style={{ padding: 24, color: "var(--color-danger)" }}>
          Не удалось загрузить заказы.
        </div>
      )}
      {orders.data && orders.data.length === 0 && (
        <div className="card-wise" style={{ padding: 24, color: "var(--color-ink-muted)" }}>
          Сейчас нет доступных заказов.
        </div>
      )}
      {orders.data?.map((o) => {
        const addr = o.deliveryAddress;
        const isCreated = o.status.toLowerCase() === "created";
        return (
          <div
            key={o.id}
            className="card-wise"
            style={{ padding: 20, display: "grid", gap: 10 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>
                  Заказ #{o.id.slice(0, 8)}
                </div>
                <div style={{ color: "var(--color-ink-muted)", fontSize: 13, marginTop: 2 }}>
                  {o.createdAt ? new Date(o.createdAt).toLocaleString("ru-RU") : ""}
                </div>
              </div>
              <span style={statusBadgeStyle(o.status)}>
                {statusLabel(o.status)}
              </span>
            </div>

            {addr && (
              <div style={{ color: "var(--color-ink-muted)", fontSize: 14 }}>
                {[addr.city, addr.street, addr.building, addr.apartament]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ color: "var(--color-ink-muted)", fontSize: 13 }}>
                Позиций: {o.items?.length ?? 0} · Доставка: {(o.deliveryFee ?? 0).toLocaleString("ru-RU")} ₽
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {isCreated && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={accept.isPending}
                    onClick={() => accept.mutate(o.id)}
                  >
                    Принять
                  </button>
                )}
                <Link
                  to="/courier/orders/$id"
                  params={{ id: o.id }}
                  className="btn btn-secondary btn-sm"
                >
                  Открыть
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
