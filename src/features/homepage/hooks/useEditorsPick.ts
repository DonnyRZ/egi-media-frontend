"use client";

import { useHomepageNews } from "@/features/homepage/hooks/useHomepageNews";

export function useEditorsPick() {
  const query = useHomepageNews();

  return {
    ...query,
    sectionFailed: Boolean(query.data?.failedSections.includes("editors")),
    data: query.data
      ? { items: query.data.editors, total: query.data.editors.length }
      : undefined,
  };
}
