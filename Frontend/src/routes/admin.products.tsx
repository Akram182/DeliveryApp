import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Pencil, Plus, X, Check, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { adminService, catalogService } from "@/lib/services";
import { apiErrorMessage, resolveImageUrl } from "@/lib/api";
import type { CreateProductDto, Product } from "@/types/api";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

const emptyDraft: CreateProductDto = {
  name: "",
  price: 1,
  stock: 1,
  isActive: true,
  image: null,
  imageUrl: "",
  categoryId: "",
};

function AdminProductsPage() {
  const qc = useQueryClient();
  const products = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => adminService.products(),
  });
  const cats = useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogService.categories(),
  });

  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<CreateProductDto>(emptyDraft);
  const [editing, setEditing] = useState<Record<string, CreateProductDto>>({});

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["catalog-products-all"] });
  };

  const create = useMutation({
    mutationFn: () => adminService.createProduct(draft),
    onSuccess: () => {
      invalidate();
      setDraft({ ...emptyDraft, categoryId: cats.data?.[0]?.id ?? "" });
      setCreating(false);
      toast.success("Товар создан");
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  const update = useMutation({
    mutationFn: (p: Product) =>
      adminService.updateProduct({ id: p.id, ...editing[p.id]! }),
    onSuccess: (_d, p) => {
      invalidate();
      setEditing((s) => {
        const n = { ...s };
        delete n[p.id];
        return n;
      });
      toast.success("Сохранено");
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminService.removeProduct(id),
    onSuccess: () => {
      invalidate();
      toast.success("Удалено");
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  const categoryName = (id?: string) =>
    cats.data?.find((c) => c.id === id)?.name ?? "—";

  return (
    <section className="card-wise" style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h3 style={{ fontSize: "1.5rem" }}>Товары</h3>
        <button
          className="btn btn-primary btn-sm"
          type="button"
          onClick={() => {
            setDraft({ ...emptyDraft, categoryId: cats.data?.[0]?.id ?? "" });
            setCreating((v) => !v);
          }}
          disabled={!cats.data || cats.data.length === 0}
        >
          <Plus size={16} /> Новый
        </button>
      </div>

      {(!cats.data || cats.data.length === 0) && (
        <p style={{ color: "var(--color-ink-muted)", marginBottom: 16 }}>
          Сначала создайте хотя бы одну категорию.
        </p>
      )}

      {creating && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.name.trim() || !draft.categoryId) {
              toast.error("Имя и категория обязательны");
              return;
            }
            create.mutate();
          }}
          style={{
            display: "grid",
            gap: 10,
            padding: 14,
            borderRadius: 16,
            background: "var(--color-surface-soft)",
            marginBottom: 16,
          }}
        >
          <ProductFields value={draft} onChange={setDraft} categories={cats.data ?? []} />
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={create.isPending}>
              <Check size={14} /> Создать
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCreating(false)}>
              <X size={14} /> Отмена
            </button>
          </div>
        </form>
      )}

      {products.isLoading && <p style={{ color: "var(--color-ink-muted)" }}>Загрузка…</p>}
      {products.data && products.data.length === 0 && (
        <p style={{ color: "var(--color-ink-muted)" }}>Товаров нет.</p>
      )}
      {products.data && products.data.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
          {products.data.map((p) => {
            const e = editing[p.id];
            return (
              <li
                key={p.id}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  boxShadow: "var(--shadow-ring)",
                  display: "grid",
                  gap: 10,
                }}
              >
                {e ? (
                  <>
                    <ProductFields
                      value={e}
                      onChange={(v) => setEditing((s) => ({ ...s, [p.id]: v }))}
                      categories={cats.data ?? []}
                      currentImageUrl={p.imageUrl}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn btn-primary btn-sm"
                        type="button"
                        onClick={() => update.mutate(p)}
                        disabled={update.isPending}
                      >
                        <Check size={14} /> Сохранить
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        type="button"
                        onClick={() =>
                          setEditing((s) => {
                            const n = { ...s };
                            delete n[p.id];
                            return n;
                          })
                        }
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "56px 1fr auto auto auto auto",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Thumb url={resolveImageUrl(p.imageUrl)} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>
                        {categoryName(p.categoryId)}
                      </div>
                    </div>
                    <span className="badge-mint">{p.stock} шт</span>
                    <span style={{ fontWeight: 800 }}>
                      {p.price.toLocaleString("ru-RU")} ₽
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      type="button"
                      onClick={() =>
                        setEditing((s) => ({
                          ...s,
                          [p.id]: {
                            name: p.name,
                            price: p.price,
                            stock: p.stock,
                            isActive: p.isActive ?? true,
                            image: null,
                            imageUrl: p.imageUrl ?? "",
                            categoryId: p.categoryId ?? "",
                          },
                        }))
                      }
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={() => {
                        if (confirm(`Удалить «${p.name}»?`)) remove.mutate(p.id);
                      }}
                      style={{ color: "var(--color-danger)" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function ProductFields({
  value,
  onChange,
  categories,
  currentImageUrl,
}: {
  value: CreateProductDto;
  onChange: (v: CreateProductDto) => void;
  categories: { id: string; name: string }[];
  currentImageUrl?: string | null;
}) {
  const preview = value.image
    ? URL.createObjectURL(value.image)
    : resolveImageUrl(currentImageUrl ?? value.imageUrl);
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "72px 2fr 1fr 1fr 2fr auto auto",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Thumb url={preview} size={72} />
        <input
          className="field"
          placeholder="Название (макс. 20)"
          maxLength={50}
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
        <input
          className="field"
          type="number"
          min={1}
          max={99999999}
          placeholder="Цена"
          value={value.price}
          onChange={(e) => onChange({ ...value, price: Number(e.target.value) })}
        />
        <input
          className="field"
          type="number"
          min={1}
          max={999999}
          placeholder="Остаток"
          value={value.stock}
          onChange={(e) => onChange({ ...value, stock: Number(e.target.value) })}
        />
        <select
          className="field"
          value={value.categoryId}
          onChange={(e) => onChange({ ...value, categoryId: e.target.value })}
        >
          <option value="" disabled>
            Категория…
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer" }}>
          <ImagePlus size={14} /> {value.image ? "Заменить" : "Фото"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              onChange({ ...value, image: e.target.files?.[0] ?? null })
            }
          />
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="checkbox"
            checked={value.isActive}
            onChange={(e) => onChange({ ...value, isActive: e.target.checked })}
          />
          Активен
        </label>
      </div>
    </div>
  );
}

function Thumb({ url, size = 56 }: { url?: string | null; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        background: "var(--color-surface-soft)",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        color: "var(--color-ink-muted)",
        fontSize: 11,
      }}
    >
      {url ? (
        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        "—"
      )}
    </div>
  );
}
