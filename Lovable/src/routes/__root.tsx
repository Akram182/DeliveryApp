import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AppShell } from "@/components/AppShell";

function NotFoundComponent() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "var(--color-bg)",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <h1 style={{ fontSize: "clamp(4rem, 14vw, 9rem)" }}>404</h1>
        <p style={{ marginTop: 16, color: "var(--color-ink-muted)" }}>
          Страница не найдена или была перемещена.
        </p>
        <div style={{ marginTop: 24 }}>
          <Link to="/" className="btn btn-primary">
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "fresh.go — доставка свежих продуктов" },
      {
        name: "description",
        content: "Свежие продукты с доставкой за 30 минут. Каталог, корзина, удобный заказ.",
      },
      { property: "og:title", content: "fresh.go — доставка свежих продуктов" },
      {
        property: "og:description",
        content: "Свежие продукты с доставкой за 30 минут.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
