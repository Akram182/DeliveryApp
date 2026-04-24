import { create } from "zustand";
import type { CartItem } from "@/types/api";
import { customerService } from "@/lib/services";
import { getStoredToken } from "@/lib/api";

interface CartState {
  items: CartItem[];
  deliveryFee: number;
  loading: boolean;
  refresh: () => Promise<void>;
  add: (productId: string, quantity?: number) => Promise<void>;
  update: (id: string, quantity: number) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => void;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  deliveryFee: 0,
  loading: false,
  refresh: async () => {
    if (!getStoredToken()) {
      set({ items: [], deliveryFee: 0 });
      return;
    }
    set({ loading: true });
    try {
      const cart = await customerService.cart();
      set({ items: cart?.items ?? [], deliveryFee: cart?.deliveryFee ?? 0, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  add: async (productId, quantity = 1) => {
    await customerService.addToCart({ productId, quantity });
    await get().refresh();
  },
  update: async (id, quantity) => {
    await customerService.updateCartItem(id, { quantity });
    await get().refresh();
  },
  remove: async (id) => {
    await customerService.removeCartItem(id);
    await get().refresh();
  },
  clear: () => set({ items: [], deliveryFee: 0 }),
}));
