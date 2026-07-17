"use client";

import { useHomepageNews } from "@/features/homepage/hooks/useHomepageNews";

export function useTopicNews() {
  const query = useHomepageNews();

  return {
    ...query,
    data: query.data?.topics,
  };
}
