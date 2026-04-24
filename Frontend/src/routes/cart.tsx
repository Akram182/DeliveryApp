import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trash2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/store/cart";
import { useAuth, getStoredToken } from "@/store/auth";
import { catalogService, customerService } from "@/lib/services";
import { apiErrorMessage, resolveImageUrl } from "@/lib/api";

export const Route = createFileRoute("/cart")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getStoredToken()) {
      throw redirect({ to: "/login" });
    }
  },
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const token = useAuth((s) => s.token);
  const { items, refresh, update, remove, loading, clear, deliveryFee } = useCart();
  const [busy, setBusy] = useState(false);
  const [addressId, setAddressId] = useState<string>("");

  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => customerService.addresses(),
    enabled: !!token,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["catalog-products-all"],
    queryFn: () => catalogService.Allproducts({ chunkLength: 200 }),
    enabled: !!token,
    staleTime: 60_000,
  });

  const productImageById = useMemo(() => {
    const map = new Map<string, string | null | undefined>();
    products.forEach((p) => map.set(p.id, p.imageUrl));
    return map;
  }, [products]);

  useEffect(() => {
    refresh();
  }, [refresh, token]);

  useEffect(() => {
    if (!addressId && addresses.length > 0) {
      setAddressId(addresses[0].id);
    }
  }, [addresses, addressId]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + (deliveryFee ?? 0);

  const checkout = async () => {
    if (!addressId) {
      toast.error("Выберите адрес доставки");
      return;
    }
    setBusy(true);
    try {
      await customerService.createOrder({ deliveryAddressId: addressId });
      toast.success("Заказ создан!");
      clear();
      await refresh();
      navigate({ to: "/" });
    } catch (e) {
      toast.error(apiErrorMessage(e, "Не удалось создать заказ"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-wise" style={{ paddingBlock: "32px 64px" }}>
      <h2 style={{ marginBottom: 24 }}>Корзина</h2>

      {loading && items.length === 0 && (
        <div className="card-wise" style={{ padding: 32, color: "var(--color-ink-muted)" }}>
          Загружаем…
        </div>
      )}

      {!loading && items.length === 0 && (
        <div
          className="card-wise"
          style={{ padding: 48, textAlign: "center", color: "var(--color-ink-muted)" }}
        >
          <p style={{ marginBottom: 16 }}>В корзине пока пусто.</p>
          <Link to="/" className="btn btn-primary">
            Перейти в каталог
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 24,
            alignItems: "start",
          }}
          className="cart-grid"
        >
          <ul
            className="card-wise"
            style={{ listStyle: "none", margin: 0, padding: 8, display: "flex", flexDirection: "column", gap: 4 }}
          >
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "64px 1fr auto auto",
                  alignItems: "center",
                  gap: 16,
                  padding: 12,
                  borderRadius: 18,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: "var(--color-surface-soft)",
                    display: "grid",
                    placeItems: "center",
                    overflow: "hidden",
                  }}
                  aria-hidden
                >
                  {(() => {
                    const img = item.imageUrl ?? productImageById.get(item.productId);
                    const resolved = resolveImageUrl(img);
                    return resolved ? (
                      <img src={resolved} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 28 }}>🥕</span>
                    );
                  })()}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "1rem", lineHeight: 1.2 }}>
                    {item.productName ?? "Товар"}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--color-ink-muted)" }}>
                    {item.price.toLocaleString("ru-RU")} ₽
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      item.quantity > 1
                        ? update(item.id, item.quantity - 1)
                        : remove(item.id)
                    }
                    aria-label="Уменьшить"
                    style={{ padding: 6 }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => update(item.id, item.quantity + 1)}
                    aria-label="Увеличить"
                    style={{ padding: 6 }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => remove(item.id)}
                  aria-label="Удалить"
                  style={{ padding: 6, color: "var(--color-danger)" }}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>

          <aside className="card-wise" style={{ padding: 24, position: "sticky", top: 88 }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: 16 }}>Итого</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "var(--color-ink-muted)" }}>Товары</span>
              <span style={{ fontWeight: 700 }}>{subtotal.toLocaleString("ru-RU")} ₽</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ color: "var(--color-ink-muted)" }}>Доставка</span>
              {deliveryFee > 0 ? (
                <span style={{ fontWeight: 700 }}>{deliveryFee.toLocaleString("ru-RU")} ₽</span>
              ) : (
                <span className="badge-mint">Бесплатно</span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                paddingTop: 16,
                borderTop: "1px solid var(--color-ring)",
                marginBottom: 20,
              }}
            >
              <span style={{ fontWeight: 700 }}>К оплате</span>
              <span className="font-display" style={{ fontSize: "2rem", fontWeight: 900 }}>
                {total.toLocaleString("ru-RU")} ₽
              </span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="cart-address"
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-ink-muted)",
                  marginBottom: 6,
                }}
              >
                Адрес доставки
              </label>
              {addressesLoading ? (
                <div style={{ fontSize: 14, color: "var(--color-ink-muted)" }}>Загружаем…</div>
              ) : addresses.length === 0 ? (
                <div style={{ fontSize: 14 }}>
                  Нет адресов.{" "}
                  <Link to="/profile/addresses" style={{ color: "var(--color-primary)" }}>
                    Добавить адрес
                  </Link>
                </div>
              ) : (
                <select
                  id="cart-address"
                  value={addressId}
                  onChange={(e) => setAddressId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid var(--color-ring)",
                    background: "var(--color-surface)",
                    fontSize: 14,
                  }}
                >
                  {addresses.map((a) => {
                    const label = [a.city, a.street, a.building, a.apartament]
                      .filter(Boolean)
                      .join(", ") || "Адрес";
                    return (
                      <option key={a.id} value={a.id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
              onClick={checkout}
              disabled={busy || addresses.length === 0}
            >
              {busy ? "Оформляем…" : "Оформить заказ"}
            </button>
          </aside>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important; }
          .cart-grid > aside { position: static !important; }
        }
      `}</style>
    </div>
  );
}
