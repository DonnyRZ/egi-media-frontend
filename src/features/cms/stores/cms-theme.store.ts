"use client";

import { create } from "zustand";

import { CMS_THEME_STORAGE_KEY } from "@/features/cms/constants/cms.constants";

export type CmsTheme = "light" | "dark";

interface CmsThemeState {
  theme: CmsTheme;
  setTheme: (theme: CmsTheme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

function applyThemeClass(theme: CmsTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function readStoredTheme(): CmsTheme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(CMS_THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const useCmsThemeStore = create<CmsThemeState>((set, get) => ({
  theme: "light",
  setTheme: (theme) => {
    localStorage.setItem(CMS_THEME_STORAGE_KEY, theme);
    applyThemeClass(theme);
    set({ theme });
  },
  toggleTheme: () => {
    get().setTheme(get().theme === "dark" ? "light" : "dark");
  },
  initTheme: () => {
    const theme = readStoredTheme();
    applyThemeClass(theme);
    set({ theme });
  },
}));
