"use client";

import { useHomepageNews } from "@/features/homepage/hooks/useHomepageNews";

export function useHeroNews() {
  const query = useHomepageNews();

  return {
    ...query,
    sectionFailed: Boolean(query.data?.failedSections.includes("hero")),
    data: query.data?.hero,
  };
}
