import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { authService, customerService } from "@/lib/services";
import { useAuth } from "@/store/auth";
import { apiErrorMessage } from "@/lib/api";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

const passwordRule = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?=.{8,}$).*$/;

function RegisterPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!passwordRule.test(form.password)) {
      setErr(
        "Пароль: минимум 8 символов, заглавная буква, цифра и спецсимвол.",
      );
      return;
    }

    setBusy(true);
    try {
      const res = await authService.register(form);
      const token = res.token ?? res.accessToken ?? null;
      if (token) {
        setToken(token);
        try {
          setUser(await customerService.me());
        } catch {
          /* ignore */
        }
        toast.success("Аккаунт создан");
        navigate({ to: "/" });
      } else {
        toast.success("Аккаунт создан, войдите");
        navigate({ to: "/login" });
      }
    } catch (e) {
      setErr(apiErrorMessage(e, "Не удалось зарегистрироваться"));
    } finally {
      setBusy(false);
    }
  };

  const setField =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="container-wise" style={{ paddingBlock: "48px 64px" }}>
      <div style={{ maxWidth: 480, marginInline: "auto" }}>
        <h2 style={{ marginBottom: 8 }}>Создать аккаунт</h2>
        <p style={{ color: "var(--color-ink-soft)", marginBottom: 32 }}>
          Это займёт меньше минуты.
        </p>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Имя" value={form.firstName} onChange={setField("firstName")} required maxLength={100} autoComplete="given-name" />
            <Field label="Фамилия" value={form.lastName} onChange={setField("lastName")} required maxLength={100} autoComplete="family-name" />
          </div>
          <Field label="Email" type="email" value={form.email} onChange={setField("email")} required autoComplete="email" />
          <Field
            label="Пароль"
            type="password"
            value={form.password}
            onChange={setField("password")}
            required
            autoComplete="new-password"
            hint="Мин. 8 символов, заглавная буква, цифра и спецсимвол"
          />

          {err && (
            <div
              role="alert"
              style={{
                background: "rgba(208,50,56,0.08)",
                color: "var(--color-danger)",
                padding: "10px 14px",
                borderRadius: 12,
                fontSize: 14,
              }}
            >
              {err}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
            {busy ? "Создаём…" : "Зарегистрироваться"}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 14, color: "var(--color-ink-muted)" }}>
          Уже есть аккаунт?{" "}
          <Link to="/login" style={{ color: "var(--color-ink)", fontWeight: 700 }}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      <input className="field" {...rest} />
      {hint && (
        <span style={{ fontSize: 12, color: "var(--color-ink-muted)", fontWeight: 500 }}>
          {hint}
        </span>
      )}
    </label>
  );
}
