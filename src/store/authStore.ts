import { create } from "zustand";
import { persist } from "zustand/middleware";

// Defines the data and functions available in the authentication store.
interface AuthState {
  token: string | null;
  userName: string | null;
  setSession: (token: string, userName: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,

      setSession: (token, userName) => set({ token, userName }),

      logout: () =>
        set({
          token: null,
          userName: null,
        }),
    }),
    {
      // A fresh key prevents previously persisted demo tokens from being reused.
      name: "itelect4-auth",

      // Only persist actual authentication data.
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
      }),
    }
  )
);

export default useAuthStore;
