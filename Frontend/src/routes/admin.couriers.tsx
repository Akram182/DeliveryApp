import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/services";
import { apiErrorMessage } from "@/lib/api";
import type { CreateCourierDto } from "@/types/api";

export const Route = createFileRoute("/admin/couriers")({
  component: AdminCouriersPage,
});

const empty: CreateCourierDto = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
};

function AdminCouriersPage() {
  const [draft, setDraft] = useState<CreateCourierDto>(empty);
  const [creating, setCreating] = useState(false);
  const [createdIds, setCreatedIds] = useState<{ id: string; email: string }[]>([]);

  const create = useMutation({
    mutationFn: () => adminService.createCourier(draft),
    onSuccess: (res) => {
      toast.success(res.message ?? "Курьер создан");
      setCreatedIds((prev) => [{ id: res.id, email: draft.email }, ...prev]);
      setDraft(empty);
      setCreating(false);
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  const inputStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid var(--color-ring)",
    background: "var(--color-surface)",
    fontSize: 14,
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
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
          <h3 style={{ margin: 0 }}>Курьеры</h3>
          <p style={{ marginTop: 4, color: "var(--color-ink-muted)", fontSize: 14 }}>
            Создавайте учётные записи курьеров. Они смогут войти по email и паролю.
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setCreating(true)}
          >
            <Plus size={16} /> Новый курьер
          </button>
        )}
      </div>

      {creating && (
        <form
          className="card-wise"
          style={{ padding: 20, display: "grid", gap: 12 }}
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>Имя</span>
              <input
                style={inputStyle}
                value={draft.firstName}
                onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
                required
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>Фамилия</span>
              <input
                style={inputStyle}
                value={draft.lastName}
                onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
                required
              />
            </label>
          </div>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>Email</span>
            <input
              type="email"
              style={inputStyle}
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              required
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>
              Пароль (мин. 8 символов, заглавная, цифра, спецсимвол)
            </span>
            <input
              type="text"
              style={inputStyle}
              value={draft.password}
              onChange={(e) => setDraft({ ...draft, password: e.target.value })}
              required
            />
          </label>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setCreating(false);
                setDraft(empty);
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={create.isPending}
            >
              <UserPlus size={16} />
              {create.isPending ? "Создаём…" : "Создать курьера"}
            </button>
          </div>
        </form>
      )}

      {createdIds.length > 0 && (
        <div className="card-wise" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Недавно созданы</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
            {createdIds.map((c) => (
              <li
                key={c.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "8px 4px",
                  borderBottom: "1px solid var(--color-ring)",
                }}
              >
                <span>{c.email}</span>
                <span style={{ color: "var(--color-ink-muted)", fontSize: 13 }}>
                  {c.id.slice(0, 8)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
