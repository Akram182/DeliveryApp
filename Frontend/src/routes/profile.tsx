import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { ProfileTabs } from "@/components/ProfileTabs";
import { ProtectedView, requireAuthBeforeLoad } from "@/components/Protected";

export const Route = createFileRoute("/profile")({
  beforeLoad: () => {
    try {
      requireAuthBeforeLoad();
    } catch (e) {
      throw e;
    }
    void redirect; // type-only usage
  },
  component: ProfileLayout,
});

function ProfileLayout() {
  return (
    <ProtectedView>
      <div className="container-wise" style={{ paddingBlock: "32px 64px" }}>
        <h2 style={{ marginBottom: 24 }}>Профиль</h2>
        <ProfileTabs
          tabs={[
            { to: "/profile", label: "Личное" },
            { to: "/profile/addresses", label: "Адреса" },
            { to: "/profile/balance", label: "Баланс" },
            { to: "/orders", label: "Заказы" },
          ]}
        />
        <Outlet />
      </div>
    </ProtectedView>
  );
}
