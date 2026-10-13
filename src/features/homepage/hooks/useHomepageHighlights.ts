"use client";

import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import { fetchHomepageHighlights } from "@/shared/services/homepage-highlights.service";
import { toContentLocale } from "@/shared/utils/locale";

export function useHomepageHighlights() {
  const lang = toContentLocale(useLocale());
  return useQuery({
    queryKey: QUERY_KEYS.homepage.highlights(lang),
    queryFn: () => fetchHomepageHighlights(lang),
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
  });
}
