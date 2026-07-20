"use client";

import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { getSeriesPage } from "@/shared/repositories/series.repository";
import { toContentLocale } from "@/shared/utils/locale";

export function useSeriesPage(page = 1) {
  const lang = toContentLocale(useLocale());

  return useQuery({
    queryKey: QUERY_KEYS.series.list({ section: "page", lang, page }),
    queryFn: () => getSeriesPage(lang, page),
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });
}
