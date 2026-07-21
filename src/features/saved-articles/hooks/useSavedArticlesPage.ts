"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { SAVED_ARTICLE_PAGE_LIMIT, SAVED_ARTICLE_STALE_TIME_MS } from "@/features/saved-articles/constants/saved-article.constants";
import { fetchSavedArticles } from "@/features/saved-articles/services/saved-article.service";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import { toContentLocale } from "@/shared/utils/locale";

export function useSavedArticlesPage(page = 1) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const lang = toContentLocale(useLocale());
  const params = { page, limit: SAVED_ARTICLE_PAGE_LIMIT };

  return useQuery({
    queryKey: QUERY_KEYS.savedArticles.list({ ...params, lang }),
    queryFn: () => fetchSavedArticles(params, lang),
    enabled: isAuthenticated,
    staleTime: SAVED_ARTICLE_STALE_TIME_MS,
  });
}
