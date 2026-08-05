import { create } from "zustand";
import { persist } from "zustand/middleware";

import { HOME_COLLECTION_FEE } from "@/utils/constants";
import type { CartItemType, VisitMode } from "@/types/booking";

export interface CartItem {
  type: CartItemType;
  id: number;
  name: string;
  category: string | null;
  labPrice: number;
  homePrice: number;
  tat?: string | null;
  /** IDs of tests bundled in this package item — only set when type === "package". */
  includedTestIds?: number[];
}

interface CartState {
  items: CartItem[];
  visitMode: VisitMode;
  drawerOpen: boolean;
  /**
   * Independent of `visitMode` on purpose — an opt-in add-on the customer explicitly adds to
   * or removes from the cart, not something implied by which visit mode they later pick in the
   * booking form.
   */
  homeCollectionAdded: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (type: CartItemType, id: number) => void;
  clearCart: () => void;
  setVisitMode: (mode: VisitMode) => void;
  isInCart: (type: CartItemType, id: number) => boolean;
  /** Returns the package cart item that bundles this test, or undefined if none. */
  getIncludingPackage: (testId: number) => CartItem | undefined;
  addHomeCollection: () => void;
  removeHomeCollection: () => void;
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
      homeCollectionAdded: false,

      addItem: (item) => {
        const exists = get().items.some((i) => i.type === item.type && i.id === item.id);
        if (exists) return;
        set({ items: [...get().items, item] });
      },

      removeItem: (type, id) => {
        set({ items: get().items.filter((i) => !(i.type === type && i.id === id)) });
      },

      clearCart: () => set({ items: [], homeCollectionAdded: false }),

      setVisitMode: (mode) => set({ visitMode: mode }),

      isInCart: (type, id) => get().items.some((i) => i.type === type && i.id === id),

      getIncludingPackage: (testId) =>
        get().items.find((i) => i.type === "package" && i.includedTestIds?.includes(testId)),

      addHomeCollection: () => set({ homeCollectionAdded: true }),
      removeHomeCollection: () => set({ homeCollectionAdded: false }),

      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      toggleDrawer: () => set({ drawerOpen: !get().drawerOpen }),
    }),
    {
      name: "carehub_cart",
      partialize: (state) => ({
        items: state.items,
        visitMode: state.visitMode,
        homeCollectionAdded: state.homeCollectionAdded,
      }),
    }
  )
);

export function useCartTotal(): number {
  const items = useCartStore((s) => s.items);
  const visitMode = useCartStore((s) => s.visitMode);
  const homeCollectionAdded = useCartStore((s) => s.homeCollectionAdded);
  const subtotal = items.reduce((sum, item) => sum + itemPrice(item, visitMode), 0);
  return subtotal + (homeCollectionAdded && items.length > 0 ? HOME_COLLECTION_FEE : 0);
}

export { itemPrice };
