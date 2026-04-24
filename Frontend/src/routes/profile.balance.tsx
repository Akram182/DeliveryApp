import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerService } from "@/lib/services";
import { apiErrorMessage } from "@/lib/api";
import { ProfileShell } from "@/components/ProfileTabs";

export const Route = createFileRoute("/profile/balance")({
  component: BalancePage,
});

function BalancePage() {
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ["me"], queryFn: () => customerService.me() });
  const history = useQuery({
    queryKey: ["balance-history"],
    queryFn: () => customerService.balanceHistory(),
  });

  const [amount, setAmount] = useState<string>("500");

  const topUp = useMutation({
    mutationFn: () => customerService.topUp({ amount: Number(amount) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      qc.invalidateQueries({ queryKey: ["balance-history"] });
      toast.success("Баланс пополнен");
    },
    onError: (e) => toast.error(apiErrorMessage(e, "Не удалось пополнить")),
  });

  const balance = me.data?.balance ?? 0;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <ProfileShell title="Баланс">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            alignItems: "center",
          }}
          className="balance-grid"
        >
          <div>
            <div style={{ fontSize: 14, color: "var(--color-ink-muted)" }}>Текущий баланс</div>
            <div className="font-display" style={{ fontSize: "3.5rem", fontWeight: 900 }}>
              {balance.toLocaleString("ru-RU")} ₽
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = Number(amount);
              if (!Number.isFinite(n) || n <= 0) {
                toast.error("Введите сумму больше 0");
                return;
              }
              topUp.mutate();
            }}
            style={{ display: "flex", gap: 8 }}
          >
            <input
              className="field"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Сумма"
              style={{ maxWidth: 220 }}
            />
            <button type="submit" className="btn btn-primary" disabled={topUp.isPending}>
              Пополнить
            </button>
          </form>
        </div>
      </ProfileShell>

      <ProfileShell title="История операций">
        {history.isLoading && <p style={{ color: "var(--color-ink-muted)" }}>Загрузка…</p>}
        {history.data && history.data.length === 0 && (
          <p style={{ color: "var(--color-ink-muted)" }}>Операций пока нет.</p>
        )}
        {history.data && history.data.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
            {history.data.map((t) => (
              <li
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 14,
                  borderRadius: 14,
                  boxShadow: "var(--shadow-ring)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{t.description ?? t.type ?? "Операция"}</div>
                  <div style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>
                    {new Date(t.createdAt).toLocaleString("ru-RU")}
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    color: t.amount >= 0 ? "var(--color-success)" : "var(--color-danger)",
                  }}
                >
                  {t.amount >= 0 ? "+" : ""}
                  {t.amount.toLocaleString("ru-RU")} ₽
                </div>
              </li>
            ))}
          </ul>
        )}
      </ProfileShell>

      <style>{`
        @media (max-width: 720px) {
          .balance-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
