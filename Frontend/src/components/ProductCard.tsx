import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import type { Product } from "@/types/api";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import { apiErrorMessage, resolveImageUrl } from "@/lib/api";

export function ProductCard({ product }: { product: Product }) {
  const token = useAuth((s) => s.token);
  const add = useCart((s) => s.add);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const outOfStock = product.stock <= 0;

  const onAdd = async () => {
    if (!token) {
      toast("Войдите, чтобы добавить в корзину");
      navigate({ to: "/login" });
      return;
    }
    setBusy(true);
    try {
      await add(product.id, 1);
      toast.success(`${product.name} добавлен в корзину`);
    } catch (e) {
      toast.error(apiErrorMessage(e, "Не удалось добавить"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <article
      className="card-wise card-wise-hover"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          aspectRatio: "1 / 1",
          background: "var(--color-surface-soft)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        }}
      >
        {product.imageUrl ? (
          // TODO: Replace with real image URL from backend
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img
            src={resolveImageUrl(product.imageUrl) ?? ""}
            alt={product.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 48 }} aria-hidden>
            🥬
          </span>
        )}
      </div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <h4
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "1.125rem",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            {product.name}
          </h4>
          {outOfStock ? (
            <span className="badge-mint" style={{ background: "rgba(208,50,56,0.1)", color: "var(--color-danger)" }}>
              Нет
            </span>
          ) : (
            <span className="badge-mint">{product.stock} шт</span>
          )}
        </div>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span
            className="font-display"
            style={{ fontWeight: 900, fontSize: "1.75rem", lineHeight: 0.85 }}
          >
            {product.price.toLocaleString("ru-RU")} ₽
          </span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onAdd}
            disabled={busy || outOfStock}
            aria-label={`Добавить ${product.name} в корзину`}
          >
            <ShoppingBag size={16} />
            В корзину
          </button>
        </div>
      </div>
    </article>
  );
}
