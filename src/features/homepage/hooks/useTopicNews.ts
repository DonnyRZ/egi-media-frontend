"use client";

import { useHomepageNews } from "@/features/homepage/hooks/useHomepageNews";

export function useTopicNews() {
  const query = useHomepageNews();

  return {
    ...query,
    sectionFailed: Boolean(query.data?.failedSections.includes("topics")),
    data: query.data?.topics,
  };
}
