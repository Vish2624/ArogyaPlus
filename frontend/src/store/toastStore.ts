import { create } from "zustand";

export interface ToastMessage {
  id: number;
  text: string;
}

interface ToastState {
  toasts: ToastMessage[];
  showToast: (text: string) => void;
  dismissToast: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],

  showToast: (text) => {
    const id = nextId++;
    set({ toasts: [...get().toasts, { id, text }] });
    setTimeout(() => get().dismissToast(id), 2600);
  },

  dismissToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));
