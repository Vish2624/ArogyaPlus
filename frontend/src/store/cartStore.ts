import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItemType, VisitMode } from "@/types/booking";

export interface CartItem {
  type: CartItemType;
  id: number;
  name: string;
  category: string | null;
  labPrice: number;
  homePrice: number;
  tat?: string | null;
}

interface CartState {
  items: CartItem[];
  visitMode: VisitMode;
  drawerOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (type: CartItemType, id: number) => void;
  clearCart: () => void;
  setVisitMode: (mode: VisitMode) => void;
  isInCart: (type: CartItemType, id: number) => boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

function itemPrice(item: CartItem, visitMode: VisitMode): number {
  const price = visitMode === "home" ? item.homePrice : item.labPrice;
  return Number.isFinite(price) ? price : 0;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      visitMode: "lab",
      drawerOpen: false,

      addItem: (item) => {
        const exists = get().items.some((i) => i.type === item.type && i.id === item.id);
        if (exists) return;
        set({ items: [...get().items, item] });
      },

      removeItem: (type, id) => {
        set({ items: get().items.filter((i) => !(i.type === type && i.id === id)) });
      },

      clearCart: () => set({ items: [] }),

      setVisitMode: (mode) => set({ visitMode: mode }),

      isInCart: (type, id) => get().items.some((i) => i.type === type && i.id === id),

      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      toggleDrawer: () => set({ drawerOpen: !get().drawerOpen }),
    }),
    {
      name: "carehub_cart",
      partialize: (state) => ({ items: state.items, visitMode: state.visitMode }),
    }
  )
);

export function useCartTotal(): number {
  const items = useCartStore((s) => s.items);
  const visitMode = useCartStore((s) => s.visitMode);
  return items.reduce((sum, item) => sum + itemPrice(item, visitMode), 0);
}

export { itemPrice };
