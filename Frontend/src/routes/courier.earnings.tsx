import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { courierService } from "@/lib/services";

export const Route = createFileRoute("/courier/earnings")({
  component: CourierEarningsPage,
});

function CourierEarningsPage() {
  const earnings = useQuery({
    queryKey: ["courier", "earnings"],
    queryFn: () => courierService.earnings(),
  });

  const total = (earnings.data ?? []).reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card-wise" style={{ padding: 20 }}>
        <div style={{ color: "var(--color-ink-muted)", fontSize: 13 }}>Сумма заработка</div>
        <div className="font-display" style={{ fontSize: "2rem", fontWeight: 900, marginTop: 6 }}>
          {total.toLocaleString("ru-RU")} ₽
        </div>
      </div>

      {earnings.isLoading && (
        <div className="card-wise" style={{ padding: 24, color: "var(--color-ink-muted)" }}>
          Загрузка…
        </div>
      )}
      {earnings.data && earnings.data.length === 0 && (
        <div className="card-wise" style={{ padding: 24, color: "var(--color-ink-muted)" }}>
          Пока нет начислений.
        </div>
      )}
      <ul
        className="card-wise"
        style={{ listStyle: "none", padding: 8, margin: 0, display: "grid", gap: 4 }}
      >
        {earnings.data?.map((e) => (
          <li
            key={e.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              alignItems: "center",
              gap: 12,
              padding: 14,
              borderRadius: 14,
            }}
          >
            <Link
              to="/courier/orders/$id"
              params={{ id: e.orderId }}
              style={{ fontWeight: 600 }}
            >
              Заказ #{e.orderId.slice(0, 8)}
            </Link>
            <div style={{ color: "var(--color-ink-muted)", fontSize: 13 }}>
              {new Date(e.createdAt).toLocaleString("ru-RU")}
            </div>
            <div style={{ fontWeight: 700 }}>
              {e.amount.toLocaleString("ru-RU")} ₽
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
