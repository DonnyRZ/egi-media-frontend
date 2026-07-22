"use client";

import { useEffect } from "react";

import { useCmsThemeStore } from "@/features/cms/stores/cms-theme.store";

/** Syncs the persisted theme into the zustand store after hydration. */
export function CmsBootstrap() {
  const initTheme = useCmsThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return null;
}
