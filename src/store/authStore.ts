import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/index";

// Defines the data and functions available in the authentication store.
interface AuthState {
  token: string | null;
  userName: string | null;
  userRole: User["role"] | null;
  setSession: (token: string, user: Pick<User, "name" | "role">) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      userRole: null,

      setSession: (token, user) =>
        set({ token, userName: user.name, userRole: user.role }),

      logout: () =>
        set({
          token: null,
          userName: null,
          userRole: null,
        }),
    }),
    {
      // A fresh key prevents previously persisted demo tokens from being reused.
      name: "itelect4-auth",

      // Only persist actual authentication data.
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
        userRole: state.userRole,
      }),
    }
  )
);

export default useAuthStore;
