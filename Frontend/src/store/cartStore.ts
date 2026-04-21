import { create } from 'zustand';
import api from '@/lib/api';
import type { Cart, AddToCartDto, UpdateCartItemDto } from '@/types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  setCart: (cart: Cart) => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,

  setCart: (cart) => set({ cart }),

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<Cart>('/Customer/cart');
      set({ cart: data ?? null, isLoading: false });
    } catch {
      set({ cart: null, isLoading: false });
    }
  },

  addItem: async (productId, quantity) => {
    const body: AddToCartDto = { productId, quantity };
    const { data } = await api.post<Cart>('/Customer/cart/items', body);
    set({ cart: data });
  },

  updateItem: async (itemId, quantity) => {
    const body: UpdateCartItemDto = { quantity };
    const { data } = await api.patch<Cart>(`/Customer/cart/items/${itemId}`, body);
    set({ cart: data });
  },

  removeItem: async (itemId) => {
    await api.delete(`/Customer/cart/items/${itemId}`);
    const { data } = await api.get<Cart>('/Customer/cart');
    set({ cart: data });
  },

  clearCart: () => set({ cart: null }),
}));