import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Pencil, Plus, X, Check, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/services";
import { apiErrorMessage, resolveImageUrl } from "@/lib/api";
import type { Category } from "@/types/api";

export const Route = createFileRoute("/admin/")({
  component: AdminCategoriesPage,
});

interface CategoryDraft {
  name: string;
  description: string;
  image: File | null;
}

const emptyDraft: CategoryDraft = { name: "", description: "", image: null };

function AdminCategoriesPage() {
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => adminService.categories(),
  });

  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<CategoryDraft>(emptyDraft);
  const [editing, setEditing] = useState<Record<string, CategoryDraft>>({});

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  };

  const create = useMutation({
    mutationFn: () => adminService.createCategory(draft),
    onSuccess: () => {
      invalidate();
      setDraft(emptyDraft);
      setCreating(false);
      toast.success("Категория создана");
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  const update = useMutation({
    mutationFn: (c: Category) =>
      adminService.updateCategory({ id: c.id, ...editing[c.id]! }),
    onSuccess: (_d, c) => {
      invalidate();
      setEditing((p) => {
        const n = { ...p };
        delete n[c.id];
        return n;
      });
      toast.success("Сохранено");
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminService.removeCategory(id),
    onSuccess: () => {
      invalidate();
      toast.success("Удалено");
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });

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
        <h3 style={{ fontSize: "1.5rem" }}>Категории</h3>
        <button
          className="btn btn-primary btn-sm"
          type="button"
          onClick={() => setCreating((v) => !v)}
        >
          <Plus size={16} /> Новая
        </button>
      </div>

      {creating && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.name.trim() || !draft.description.trim()) {
              toast.error("Заполните название и описание");
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
          <CategoryFields value={draft} onChange={setDraft} />
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

      {list.isLoading && <p style={{ color: "var(--color-ink-muted)" }}>Загрузка…</p>}
      {list.data && list.data.length === 0 && (
        <p style={{ color: "var(--color-ink-muted)" }}>Категорий нет.</p>
      )}
      {list.data && list.data.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
          {list.data.map((c) => {
            const e = editing[c.id];
            return (
              <li
                key={c.id}
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
                    <CategoryFields
                      value={e}
                      onChange={(v) => setEditing((s) => ({ ...s, [c.id]: v }))}
                      currentImageUrl={c.imageUrl}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn btn-primary btn-sm"
                        type="button"
                        onClick={() => update.mutate(c)}
                        disabled={update.isPending}
                      >
                        <Check size={14} /> Сохранить
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        type="button"
                        onClick={() =>
                          setEditing((p) => {
                            const n = { ...p };
                            delete n[c.id];
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
                      gridTemplateColumns: "56px 1fr 1fr auto auto",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Thumb url={c.imageUrl} />
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    <div style={{ color: "var(--color-ink-muted)", fontSize: 14 }}>
                      {c.description}
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      type="button"
                      onClick={() =>
                        setEditing((p) => ({
                          ...p,
                          [c.id]: {
                            name: c.name,
                            description: c.description ?? "",
                            image: null,
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
                        if (confirm(`Удалить категорию «${c.name}»?`)) remove.mutate(c.id);
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

function CategoryFields({
  value,
  onChange,
  currentImageUrl,
}: {
  value: CategoryDraft;
  onChange: (v: CategoryDraft) => void;
  currentImageUrl?: string | null;
}) {
  const preview = value.image
    ? URL.createObjectURL(value.image)
    : resolveImageUrl(currentImageUrl);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "72px 1fr 1fr auto",
        gap: 10,
        alignItems: "center",
      }}
    >
      <Thumb url={preview} size={72} />
      <input
        className="field"
        placeholder="Название"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />
      <input
        className="field"
        placeholder="Описание"
        value={value.description}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />
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
        <img
          src={url}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        "—"
      )}
    </div>
  );
}
