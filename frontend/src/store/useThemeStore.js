import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme")||"dark",
  setTheme: (Theme) => {
    localStorage.setItem("chat-theme", Theme);
    set({ theme: Theme });
  },
}));