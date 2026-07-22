"use client";

import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { getColumnsPage } from "@/features/columns/repositories/column.repository";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import { toContentLocale } from "@/shared/utils/locale";

export function useColumnsPage(page = 1) {
  const lang = toContentLocale(useLocale());

  return useQuery({
    queryKey: QUERY_KEYS.columns.list({ section: "page", lang, page }),
    queryFn: () => getColumnsPage(lang, page),
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });
}
