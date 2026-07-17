"use client";

import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { getEditorsPicks } from "@/shared/repositories/article.repository";
import { toContentLocale } from "@/shared/utils/locale";

export function useEditorsPick() {
  const lang = toContentLocale(useLocale());

  return useQuery({
    queryKey: QUERY_KEYS.articles.list({ section: "editors", lang }),
    queryFn: () => getEditorsPicks(lang),
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });
}
