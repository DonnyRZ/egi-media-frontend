"use client";

import { useHomepageNews } from "@/features/homepage/hooks/useHomepageNews";

export function useEditorsPick() {
  const query = useHomepageNews();

  return {
    ...query,
    data: query.data
      ? { items: query.data.editors, total: query.data.editors.length }
      : undefined,
  };
}
