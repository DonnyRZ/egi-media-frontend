"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { getCategoriesPage } from "@/shared/repositories/category.repository";

export function useCategoriesPage(page = 1) {
  return useQuery({
    queryKey: QUERY_KEYS.categories.list({ section: "page", page }),
    queryFn: () => getCategoriesPage(page),
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });
}
