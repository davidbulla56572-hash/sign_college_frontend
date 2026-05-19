import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthUser } from "../types/auth.types";

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (accessToken: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setSession: (accessToken, user) =>
        set({ accessToken, user, isAuthenticated: true }),
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearSession: () =>
        set({ accessToken: null, user: null, isAuthenticated: false })
    }),
    {
      name: "sign-college-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
