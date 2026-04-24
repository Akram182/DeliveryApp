import { create } from "zustand";
import type { User } from "@/types/api";
import { getStoredToken, setStoredToken, setUnauthorizedHandler } from "@/lib/api";
import { customerService } from "@/lib/services";

interface AuthState {
  token: string | null;
  user: User | null;
  status: "idle" | "loading" | "ready";
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  hydrate: () => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  user: null,
  status: "idle",
  setToken: (token) => {
    setStoredToken(token);
    set({ token });
  },
  setUser: (user) => set({ user }),
  hydrate: async () => {
    if (typeof window === "undefined") return;
    const token = getStoredToken();
    if (!token) {
      set({ status: "ready" });
      return;
    }
    set({ token, status: "loading" });
    try {
      const user = await customerService.me();
      set({ user, status: "ready" });
    } catch {
      setStoredToken(null);
      set({ token: null, user: null, status: "ready" });
    }
  },
  logout: () => {
    setStoredToken(null);
    set({ token: null, user: null });
  },
}));

if (typeof window !== "undefined") {
  setUnauthorizedHandler(() => {
    useAuth.getState().logout();
  });
}

export const isAuthenticated = () => !!useAuth.getState().token;
export { useAuth as default };
// helper to consume auth state outside React if needed
export const getAuth = () => useAuth.getState();
// re-export for convenience
export { getStoredToken };

// no-op to satisfy TS isolated modules
export type { AuthState };

