"use client";

import { useHomepageNews } from "@/features/homepage/hooks/useHomepageNews";

export function useBreakingNews() {
  const query = useHomepageNews();

  return {
    ...query,
    sectionFailed: Boolean(query.data?.failedSections.includes("breaking")),
    data: query.data
      ? { items: query.data.breaking, total: query.data.breaking.length }
      : undefined,
  };
}
