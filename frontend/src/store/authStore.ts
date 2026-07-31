import { create } from "zustand";

import { ADMIN_TOKEN_KEY } from "@/services/api";
import type { AdminUser } from "@/types/auth";

interface AuthState {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  setSession: (token: string) => void;
  setAdmin: (admin: AdminUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: localStorage.getItem(ADMIN_TOKEN_KEY),
  admin: null,
  isAuthenticated: Boolean(localStorage.getItem(ADMIN_TOKEN_KEY)),

  setSession: (token) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    set({ token, isAuthenticated: true });
  },

  setAdmin: (admin) => set({ admin }),

  logout: () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    set({ token: null, admin: null, isAuthenticated: false });
  },
}));
