"use client";

import { Icons } from "@/features/cms/components/ui/Icons";
import { useCmsThemeStore } from "@/features/cms/stores/cms-theme.store";

export function ThemeToggle() {
  const theme = useCmsThemeStore((state) => state.theme);
  const toggleTheme = useCmsThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
      onClick={toggleTheme}
      type="button"
    >
      {isDark ? <Icons.sun /> : <Icons.moon />}
    </button>
  );
}
