"use client";

import { useHomepageNews } from "@/features/homepage/hooks/useHomepageNews";

export function useLatestNews() {
  const query = useHomepageNews();

  return {
    ...query,
    data: query.data
      ? { items: query.data.latest, total: query.data.latest.length }
      : undefined,
  };
}
