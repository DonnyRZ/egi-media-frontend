"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  PERSONALIZED_FEED_LIMIT,
  PERSONALIZED_FEED_STALE_TIME_MS,
} from "@/features/for-you/constants/for-you.constants";
import { fetchPersonalizedArticles } from "@/features/for-you/services/personalized-feed.service";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import { toContentLocale } from "@/shared/utils/locale";

export function usePersonalizedFeed(page = 1, limit = PERSONALIZED_FEED_LIMIT) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const lang = toContentLocale(useLocale());
  const params = { page, limit, lang };

  return useQuery({
    queryKey: QUERY_KEYS.personalizedFeed.list(params),
    queryFn: () => fetchPersonalizedArticles({ page, limit }, lang),
    enabled: isHydrated && isAuthenticated,
    staleTime: PERSONALIZED_FEED_STALE_TIME_MS,
  });
}
