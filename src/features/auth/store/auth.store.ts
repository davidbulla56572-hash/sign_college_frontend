import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthUser } from "../types/auth.types";

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  setSession: (accessToken: string, user: AuthUser) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setSession: (accessToken, user) => set({ accessToken, user }),
      clearSession: () => set({ accessToken: null, user: null })
    }),
    {
      name: "sign-college-auth"
    }
  )
);
