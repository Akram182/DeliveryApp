import { create } from "zustand";
import { customerService } from "@/lib/services";

interface CartState {
  items: { id: string; productId: string; productName: string; productPrice: number; quantity: number }[];
  status: "idle" | "loading" | "ready";
  refresh: () => Promise<void>;
  clear: () => void;
}

export const useCart = create<CartState>((set) => ({
  items: [],
  status: "idle",
  refresh: async () => {
    set({ status: "loading" });
    try {
      const cart = await customerService.cart();
      set({ items: cart.items, status: "ready" });
    } catch {
      set({ status: "ready" });
    }
  },
  clear: () => set({ items: [] }),
}));

export type { CartState };