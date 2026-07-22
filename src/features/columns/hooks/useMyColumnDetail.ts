"use client";

import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { getMyColumnDetail } from "@/features/columns/repositories/column.repository";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import { toContentLocale } from "@/shared/utils/locale";

export function useMyColumnDetail(columnId: string) {
  const lang = toContentLocale(useLocale());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  return useQuery({
    queryKey: QUERY_KEYS.columns.mineDetail(columnId, lang),
    queryFn: () => getMyColumnDetail(columnId, lang),
    enabled: isHydrated && isAuthenticated && Boolean(columnId),
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });
}
