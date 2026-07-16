"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { getActiveNewsletters } from "@/shared/repositories/newsletter.repository";

export function useNewsletter() {
  return useQuery({
    queryKey: QUERY_KEYS.newsletters.list({ section: "cta" }),
    queryFn: getActiveNewsletters,
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });
}
