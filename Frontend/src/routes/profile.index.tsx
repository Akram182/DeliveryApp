import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerService } from "@/lib/services";
import { apiErrorMessage } from "@/lib/api";
import { ProfileShell } from "@/components/ProfileTabs";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/profile/")({
  component: ProfileIndex,
});

function ProfileIndex() {
  const qc = useQueryClient();
  const setUser = useAuth((s) => s.setUser);

  const me = useQuery({
    queryKey: ["me"],
    queryFn: () => customerService.me(),
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (me.data) {
      setFirstName(me.data.firstName ?? "");
      setLastName(me.data.lastName ?? "");
      setDirty(false);
    }
  }, [me.data]);

  const update = useMutation({
    mutationFn: () => customerService.updateMe({ firstName, lastName }),
    onSuccess: (u) => {
      setUser(u);
      qc.setQueryData(["me"], u);
      toast.success("Сохранено");
      setDirty(false);
    },
    onError: (e) => toast.error(apiErrorMessage(e, "Не удалось сохранить")),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <ProfileShell title="Личные данные">
        {me.isLoading ? (
          <p style={{ color: "var(--color-ink-muted)" }}>Загрузка…</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update.mutate();
            }}
            style={{ display: "grid", gap: 14, maxWidth: 520 }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field
                label="Имя"
                value={firstName}
                onChange={(v) => {
                  setFirstName(v);
                  setDirty(true);
                }}
              />
              <Field
                label="Фамилия"
                value={lastName}
                onChange={(v) => {
                  setLastName(v);
                  setDirty(true);
                }}
              />
            </div>
            <Field label="Email" value={me.data?.email ?? ""} onChange={() => {}} disabled />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!dirty || update.isPending}
              style={{ justifySelf: "start" }}
            >
              {update.isPending ? "Сохраняем…" : "Сохранить"}
            </button>
          </form>
        )}
      </ProfileShell>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      <input
        className="field"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
