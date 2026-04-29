import { create } from "zustand";
import { useNotificationStore } from "./notification-store";

type Theme = "dark" | "light";
type Density = "comfortable" | "compact";
type Direction = "ltr" | "rtl";

type UIState = {
  theme: Theme;
  density: Density;
  direction: Direction;

  aiEnabled: boolean;
  aiAutoSuggestions: boolean;

  setTheme: (theme: Theme) => void;
  setDensity: (density: Density) => void;
  setDirection: (direction: Direction) => void;

  setAIEnabled: (value: boolean) => void;
  setAISuggestions: (value: boolean) => void;
};

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function applyDensity(density: Density) {
  document.documentElement.dataset.density = density;
}

function applyDirection(direction: Direction) {
  document.documentElement.setAttribute("dir", direction);
}

export const useUIStore = create<UIState>((set) => ({
  theme: "dark",
  density: "comfortable",
  direction: "ltr",

  aiEnabled: true,
  aiAutoSuggestions: true,

  setTheme: (theme) =>
    set((state) => {
      if (state.theme === theme) {
        return state;
      }

      applyTheme(theme);

      useNotificationStore.getState().addNotification({
        type: "theme",
        title: "Theme changed",
        description:
          theme === "dark"
            ? "Dark mode is now active"
            : "Light mode is now active",
      });

      return { theme };
    }),

  setDensity: (density) => {
    applyDensity(density);
    set({ density });
  },

  setDirection: (direction) => {
    applyDirection(direction);
    set({ direction });
  },

  setAIEnabled: (value) => {
    set({ aiEnabled: value });

    useNotificationStore.getState().addNotification({
      type: "ai",
      title: value ? "AI enabled" : "AI disabled",
      description: value
        ? "Nexus AI is now active"
        : "Nexus AI has been turned off",
    });
  },

  setAISuggestions: (value) => {
    set({ aiAutoSuggestions: value });
  },
}));
