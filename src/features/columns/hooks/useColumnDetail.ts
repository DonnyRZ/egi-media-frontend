"use client";

import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { getColumnDetail } from "@/features/columns/repositories/column.repository";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import { toContentLocale } from "@/shared/utils/locale";

export function useColumnDetail(slug: string) {
  const lang = toContentLocale(useLocale());

  return useQuery({
    queryKey: QUERY_KEYS.columns.detail(slug, lang),
    queryFn: () => getColumnDetail(slug, lang),
    enabled: Boolean(slug),
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });
}
