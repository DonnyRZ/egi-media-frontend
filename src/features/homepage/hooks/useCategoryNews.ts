"use client";

import { useHomepageNews } from "@/features/homepage/hooks/useHomepageNews";

export function useCategoryNews() {
  const query = useHomepageNews();

  return {
    ...query,
    data: query.data?.categories,
  };
}
