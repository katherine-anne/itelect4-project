import { create } from "zustand";
import { persist } from "zustand/middleware";

// Defines the data and functions available in the authentication store.
interface AuthState {
  token: string | null;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,

      login: (name) =>
        set({
          token: `demo-token-${name}`,
          userName: name,
        }),

      logout: () =>
        set({
          token: null,
          userName: null,
        }),
    }),
    {
      name: "lost-and-found-auth",

      // Only persist actual authentication data.
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
      }),
    }
  )
);

export default useAuthStore;