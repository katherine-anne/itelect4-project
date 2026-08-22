import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isDarkMode: false,

      toggleDarkMode: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        })),
    }),
    {
      name: "lost-and-found-ui",

      // Only save UI data, not functions.
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

export default useUiStore;