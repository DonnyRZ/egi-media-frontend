"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  SAVED_COLUMN_PAGE_LIMIT,
  SAVED_COLUMN_STALE_TIME_MS,
} from "@/features/columns/constants/column.constants";
import { getSavedColumnsPage } from "@/features/columns/repositories/column.repository";
import { saveSavedColumnIds } from "@/features/columns/utils/saved-column-storage";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import { toContentLocale } from "@/shared/utils/locale";

export function useSavedColumnsPage(page = 1) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.user?.id);
  const lang = toContentLocale(useLocale());

  const query = useQuery({
    queryKey: QUERY_KEYS.savedColumns.list({ page, lang }),
    queryFn: () => getSavedColumnsPage(lang, page),
    enabled: isAuthenticated,
    staleTime: SAVED_COLUMN_STALE_TIME_MS,
  });

  useEffect(() => {
    if (!userId || !query.data) return;
    // Keep button state in sync with the server list for the current page.
    // Merge with existing local ids outside this page would need a full fetch;
    // for now replace with current page ids when page === 1 and total fits.
    if (page === 1 && query.data.total <= SAVED_COLUMN_PAGE_LIMIT) {
      saveSavedColumnIds(
        userId,
        query.data.items.map((item) => item.id),
      );
    }
  }, [userId, query.data, page]);

  return query;
}
