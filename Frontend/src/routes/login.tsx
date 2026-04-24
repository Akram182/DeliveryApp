import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { authService, customerService } from "@/lib/services";
import { useAuth } from "@/store/auth";
import { apiErrorMessage } from "@/lib/api";
import type { AuthResponse } from "@/types/api";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function extractToken(res: AuthResponse): string | null {
  return res.token ?? res.accessToken ?? null;
}

function LoginPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await authService.login({ email, password });
      const token = extractToken(res);
      if (!token) throw new Error("Сервер не вернул токен");
      setToken(token);
      try {
        const me = await customerService.me();
        setUser(me);
      } catch {
        /* ignore */
      }
      toast.success("С возвращением!");
      navigate({ to: "/" });
    } catch (e) {
      setErr(apiErrorMessage(e, "Не удалось войти"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-wise" style={{ paddingBlock: "48px 64px" }}>
      <div style={{ maxWidth: 440, marginInline: "auto" }}>
        <h2 style={{ marginBottom: 8 }}>Войти</h2>
        <p style={{ color: "var(--color-ink-soft)", marginBottom: 32 }}>
          Введите email и пароль, чтобы продолжить.
        </p>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Пароль</span>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className="field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 56, width: "100%" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-ink-muted)",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "6px 10px",
                  borderRadius: 8,
                }}
              >
                {showPassword ? "Скрыть" : "Показать"}
              </button>
            </div>
          </label>

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
            {busy ? "Входим…" : "Войти"}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 14, color: "var(--color-ink-muted)" }}>
          Нет аккаунта?{" "}
          <Link to="/register" style={{ color: "var(--color-ink)", fontWeight: 700 }}>
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
