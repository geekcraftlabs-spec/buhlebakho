"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  hasOpenedOnce: boolean;
  lastAddedAt: number;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasOpenedOnce: false,
      lastAddedAt: 0,

      addItem: (item) => {
        const existing = get().items.find((i) => i.variantId === item.variantId);
        const shouldOpen = !get().hasOpenedOnce;

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            isOpen: shouldOpen ? true : get().isOpen,
            hasOpenedOnce: true,
            lastAddedAt: Date.now(),
          });
        } else {
          set({
            items: [...get().items, item],
            isOpen: shouldOpen ? true : get().isOpen,
            hasOpenedOnce: true,
            lastAddedAt: Date.now(),
          });
        }
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter((i) => i.variantId !== variantId),
        });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true, hasOpenedOnce: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen, hasOpenedOnce: true }),
    }),
    {
      name: "buhlebakho-cart",
      partialize: (state) => ({
        items: state.items,
        hasOpenedOnce: state.hasOpenedOnce,
      }),
    }
  )
);

export const useCartSubtotal = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));

export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));