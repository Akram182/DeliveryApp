import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useAuth } from "@/store/auth";
import { Header } from "./Header";

export function AppShell({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
  }));
  const hydrate = useAuth((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <QueryClientProvider client={client}>
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <footer
          className="container-wise"
          style={{
            paddingBlock: 32,
            color: "var(--color-ink-muted)",
            fontSize: 14,
            borderTop: "1px solid var(--color-ring)",
            marginTop: 64,
          }}
        >
          © {new Date().getFullYear()} fresh.go — доставка свежих продуктов
        </footer>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}
