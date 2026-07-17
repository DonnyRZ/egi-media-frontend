"use client";

import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import { getHomepageNews } from "@/shared/repositories/homepage.repository";
import { toContentLocale } from "@/shared/utils/locale";

export function useHomepageNews() {
  const lang = toContentLocale(useLocale());

  return useQuery({
    queryKey: QUERY_KEYS.homepage.news(lang),
    queryFn: () => getHomepageNews(lang),
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });
}
