"use client";

import { useHomepageNews } from "@/features/homepage/hooks/useHomepageNews";

export function useHeroNews() {
  const query = useHomepageNews();

  return {
    ...query,
    data: query.data?.hero,
  };
}
