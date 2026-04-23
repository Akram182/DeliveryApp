import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { catalogService } from "@/lib/services";
import { CategoryItem } from "@/components/CategoryItem";
import { ProductCard } from "@/components/ProductCard";

const search = z.object({
  category: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(search),
  component: CatalogPage,
});

function CatalogPage() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const cats = useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogService.categories(),
  });

  // Используем cats.data?.categories для получения массива категорий
  const categoriesList = cats.data?.categories ?? [];

  const selected =
    category ?? (categoriesList.length > 0 ? categoriesList[0]?.id : undefined);

  const products = useQuery({
    queryKey: ["products", selected],
    queryFn: () => catalogService.products({ category: selected, chunkLength: 20 }),
    enabled: !!selected,
  });

  return (
    <div className="container-wise" style={{ paddingBlock: "32px 64px" }}>
      {/* Hero */}
      <section style={{ paddingBlock: "32px 48px", maxWidth: 880 }}>
        <h1>
          Свежее.{" "}
          <span
            style={{
              background: "var(--color-wise-green)",
              color: "var(--color-wise-green-deep)",
              padding: "0 18px",
              borderRadius: 9999,
              display: "inline-block",
            }}
          >
            быстро.
          </span>{" "}
          к двери.
        </h1>
        <p
          style={{
            marginTop: 24,
            fontSize: "1.125rem",
            fontWeight: 500,
            color: "var(--color-ink-soft)",
            maxWidth: 560,
          }}
        >
          Выбирайте категорию слева и собирайте корзину справа. Доставим за 30 минут — без
          лишних кликов и без скрытых комиссий.
        </p>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 30%) 1fr",
          gap: 24,
          alignItems: "start",
        }}
        className="catalog-grid"
      >
        {/* Categories — sticky on desktop */}
        <aside
          className="card-wise"
          style={{
            padding: 16,
            position: "sticky",
            top: 88,
            maxHeight: "calc(100dvh - 112px)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div
            style={{
              padding: "6px 12px 12px",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--color-ink-muted)",
            }}
          >
            Категории
          </div>
          {cats.isLoading && <SkeletonList rows={6} height={56} />}
          {cats.isError && <p style={{ padding: 12, color: "var(--color-danger)" }}>Не удалось загрузить</p>}
          {/* Используем categoriesList */}
          {categoriesList.map((c) => (
            <CategoryItem
              key={c.id}
              category={c}
              active={selected === c.id}
              onSelect={(id) =>
                navigate({ search: (prev: { category?: string }) => ({ ...prev, category: id }) })
              }
            />
          ))}
          {!cats.isLoading && categoriesList.length === 0 && (
            <p style={{ padding: 12, color: "var(--color-ink-muted)" }}>Категорий пока нет</p>
          )}
        </aside>

        {/* Products grid */}
        <section>
          {!selected && !cats.isLoading && (
            <EmptyState text="Выберите категорию слева, чтобы увидеть товары." />
          )}
          {products.isLoading && (
            <div className="product-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="card-wise"
                  style={{ height: 320, animation: "pulse 1.4s ease-in-out infinite" }}
                />
              ))}
            </div>
          )}
          {products.isError && (
            <EmptyState text="Не удалось загрузить товары. Попробуйте позже." />
          )}
          {/* ИСПРАВЛЕНО: используем products.data.products */}
          {products.data && products.data.products && products.data.products.length === 0 && (
            <EmptyState text="В этой категории пока пусто." />
          )}
          {products.data && products.data.products && products.data.products.length > 0 && (
            <div className="product-grid">
              {/* ИСПРАВЛЕНО: используем products.data.products.map */}
              {products.data.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @media (max-width: 768px) {
          .catalog-grid {
            gridTemplateColumns: 1fr !important;
          }
          .catalog-grid > aside {
            position: static !important;
            max-height: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function SkeletonList({ rows, height }: { rows: number; height: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height,
            borderRadius: 16,
            background: "var(--color-surface-soft)",
            animation: "pulse 1.4s ease-in-out infinite",
          }}
        />
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      className="card-wise"
      style={{
        padding: "48px 24px",
        textAlign: "center",
        color: "var(--color-ink-muted)",
        fontSize: "1rem",
      }}
    >
      {text}
    </div>
  );
}