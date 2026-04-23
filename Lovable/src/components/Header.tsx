import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ShoppingBag, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import { Logo } from "./Logo";

export function Header() {
  const { token, user, logout } = useAuth();
  const items = useCart((s) => s.items);
  const refresh = useCart((s) => s.refresh);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) refresh();
  }, [token, refresh]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(252, 251, 248, 0.85)",
        backdropFilter: "saturate(140%) blur(10px)",
        borderBottom: "1px solid var(--color-ring)",
      }}
    >
      <div
        className="container-wise"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
          gap: 16,
        }}
      >
        <Link to="/" style={{ display: "inline-flex", alignItems: "center" }}>
          <Logo />
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/" className="btn btn-ghost btn-sm">
            Каталог
          </Link>

          {token ? (
            <>
              <Link to="/cart" className="btn btn-ghost btn-sm" aria-label="Корзина">
                <ShoppingBag size={18} />
                <span>Корзина</span>
                {count > 0 && (
                  <span
                    style={{
                      background: "var(--color-wise-green)",
                      color: "var(--color-wise-green-deep)",
                      borderRadius: 9999,
                      padding: "2px 8px",
                      fontSize: 12,
                      fontWeight: 700,
                      marginLeft: 4,
                    }}
                  >
                    {count}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="btn btn-ghost btn-sm">
                Заказы
              </Link>
              {(user?.role === "admin" || user?.role === "Admin") && (
                <Link to="/admin" className="btn btn-ghost btn-sm">
                  Админ
                </Link>
              )}
              <Link to="/profile" className="btn btn-secondary btn-sm">
                <UserIcon size={16} />
                <span>{user?.firstName ?? user?.email ?? "Профиль"}</span>
              </Link>
              <button
                className="btn btn-ghost btn-sm"
                type="button"
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                aria-label="Выйти"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Войти
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
