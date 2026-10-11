"use client";

import { useHomepageNews } from "@/features/homepage/hooks/useHomepageNews";

export function useCategoryNews() {
  const query = useHomepageNews();

  return {
    ...query,
    sectionFailed: Boolean(query.data?.failedSections.includes("categories")),
    data: query.data?.categories,
  };
}
