import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Power } from "lucide-react";
import { toast } from "sonner";
import { courierService } from "@/lib/services";
import { apiErrorMessage } from "@/lib/api";

export const Route = createFileRoute("/courier/")({
  component: CourierProfilePage,
});

function CourierProfilePage() {
  const qc = useQueryClient();
  const profile = useQuery({
    queryKey: ["courier", "profile"],
    queryFn: () => courierService.profile(),
  });

  const toggle = useMutation({
    mutationFn: (isAvailable: boolean) =>
      courierService.updateAvailability({ isAvailable }),
    onSuccess: (res) => {
      toast.success(res.message ?? "Доступность обновлена");
      qc.invalidateQueries({ queryKey: ["courier", "profile"] });
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  if (profile.isLoading) {
    return (
      <div className="card-wise" style={{ padding: 32, color: "var(--color-ink-muted)" }}>
        Загрузка…
      </div>
    );
  }
  if (profile.isError || !profile.data) {
    return (
      <div className="card-wise" style={{ padding: 32, color: "var(--color-danger)" }}>
        Не удалось загрузить профиль курьера.
      </div>
    );
  }

  const p = profile.data;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card-wise" style={{ padding: 24, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {p.firstName} {p.lastName}
            </div>
            <div style={{ color: "var(--color-ink-muted)", marginTop: 4 }}>{p.email}</div>
          </div>
          <button
            type="button"
            className="btn btn-sm"
            style={{
              background: p.isAvailable ? "var(--color-wise-green)" : "var(--color-surface)",
              color: p.isAvailable ? "var(--color-wise-green-deep)" : "var(--color-ink)",
              border: "1px solid var(--color-ring)",
            }}
            disabled={toggle.isPending}
            onClick={() => toggle.mutate(!p.isAvailable)}
          >
            <Power size={16} />
            {p.isAvailable ? "Доступен" : "Не на смене"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card-wise" style={{ padding: 20 }}>
          <div style={{ color: "var(--color-ink-muted)", fontSize: 13 }}>Активные заказы</div>
          <div className="font-display" style={{ fontSize: "2rem", fontWeight: 900, marginTop: 6 }}>
            {p.activeOrdersCount}
          </div>
        </div>
        <div className="card-wise" style={{ padding: 20 }}>
          <div style={{ color: "var(--color-ink-muted)", fontSize: 13 }}>Всего заработано</div>
          <div className="font-display" style={{ fontSize: "2rem", fontWeight: 900, marginTop: 6 }}>
            {p.totalEarnings.toLocaleString("ru-RU")} ₽
          </div>
        </div>
      </div>
    </div>
  );
}
