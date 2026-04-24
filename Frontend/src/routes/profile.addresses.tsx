import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { customerService } from "@/lib/services";
import { apiErrorMessage } from "@/lib/api";
import { ProfileShell } from "@/components/ProfileTabs";
import type { CreateAddressDto } from "@/types/api";

export const Route = createFileRoute("/profile/addresses")({
  component: AddressesPage,
});

const empty: CreateAddressDto = {
  city: "",
  street: "",
  building: "",
  apartament: "",
  comment: "",
  leaveAtDoor: false,
};

function AddressesPage() {
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["addresses"],
    queryFn: () => customerService.addresses(),
  });
  const [form, setForm] = useState<CreateAddressDto>(empty);
  const [open, setOpen] = useState(false);

  const create = useMutation({
    mutationFn: (dto: CreateAddressDto) => customerService.addAddress(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Адрес добавлен");
      setForm(empty);
      setOpen(false);
    },
    onError: (e) => toast.error(apiErrorMessage(e, "Не удалось добавить")),
  });

  const remove = useMutation({
    mutationFn: (id: string) => customerService.removeAddress(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Адрес удалён");
    },
    onError: (e) => toast.error(apiErrorMessage(e, "Не удалось удалить")),
  });

  return (
    <ProfileShell
      title="Адреса"
      action={
        <button className="btn btn-primary btn-sm" type="button" onClick={() => setOpen((v) => !v)}>
          <Plus size={16} /> Добавить
        </button>
      }
    >
      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate(form);
          }}
          style={{
            display: "grid",
            gap: 12,
            padding: 16,
            borderRadius: 16,
            background: "var(--color-surface-soft)",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", gap: 10 }}>
            <Inp p="Город" v={form.city ?? ""} on={(v) => setForm({ ...form, city: v })} />
            <Inp p="Улица" v={form.street ?? ""} on={(v) => setForm({ ...form, street: v })} />
            <Inp p="Дом" v={form.building ?? ""} on={(v) => setForm({ ...form, building: v })} />
            <Inp p="Кв." v={form.apartament ?? ""} on={(v) => setForm({ ...form, apartament: v })} />
          </div>
          <Inp p="Комментарий" v={form.comment ?? ""} on={(v) => setForm({ ...form, comment: v })} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <input
              type="checkbox"
              checked={form.leaveAtDoor ?? false}
              onChange={(e) => setForm({ ...form, leaveAtDoor: e.target.checked })}
            />
            Оставить у двери
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={create.isPending}>
              {create.isPending ? "Сохраняем…" : "Сохранить"}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
              Отмена
            </button>
          </div>
        </form>
      )}

      {list.isLoading && <p style={{ color: "var(--color-ink-muted)" }}>Загрузка…</p>}
      {list.data && list.data.length === 0 && (
        <p style={{ color: "var(--color-ink-muted)" }}>Адресов пока нет.</p>
      )}
      {list.data && list.data.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
          {list.data.map((a) => (
            <li
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 14,
                borderRadius: 16,
                boxShadow: "var(--shadow-ring)",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>
                  {[a.city, a.street].filter(Boolean).join(", ") || "Адрес"}
                </div>
                <div style={{ fontSize: 14, color: "var(--color-ink-muted)" }}>
                  {[
                    a.building && `д. ${a.building}`,
                    a.apartament && `кв. ${a.apartament}`,
                    a.leaveAtDoor && "оставить у двери",
                    a.comment,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  if (confirm("Удалить адрес?")) remove.mutate(a.id);
                }}
                style={{ color: "var(--color-danger)" }}
                aria-label="Удалить"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </ProfileShell>
  );
}

function Inp({ p, v, on }: { p: string; v: string; on: (v: string) => void }) {
  return (
    <input
      className="field"
      placeholder={p}
      value={v}
      onChange={(e) => on(e.target.value)}
    />
  );
}
