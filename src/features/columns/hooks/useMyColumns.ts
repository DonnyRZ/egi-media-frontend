"use client";

import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { getMyColumnsPage } from "@/features/columns/repositories/column.repository";
import type { ColumnStatus } from "@/features/columns/types/column.types";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import { toContentLocale } from "@/shared/utils/locale";

export function useMyColumns(page = 1, status?: ColumnStatus) {
  const lang = toContentLocale(useLocale());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  return useQuery({
    queryKey: QUERY_KEYS.columns.mine({ lang, page, status }),
    queryFn: () => getMyColumnsPage({ page, status, lang }),
    enabled: isHydrated && isAuthenticated,
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });
}
