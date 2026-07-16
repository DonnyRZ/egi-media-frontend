"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { getHeroNews } from "@/shared/repositories/article.repository";

export function useHeroNews() {
  return useQuery({
    queryKey: QUERY_KEYS.articles.list({ section: "hero" }),
    queryFn: getHeroNews,
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });
}
