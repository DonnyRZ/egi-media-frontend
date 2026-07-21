"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  NEWSLETTER_PAGE_LIMIT,
  NEWSLETTER_STALE_TIME_MS,
} from "@/features/newsletters/constants/newsletter.constants";
import { fetchNewsletters } from "@/features/newsletters/services/newsletter.service";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useNewslettersPage(page = 1) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const params = { page, limit: NEWSLETTER_PAGE_LIMIT };

  return useQuery({
    queryKey: QUERY_KEYS.newsletters.list(params),
    queryFn: () => fetchNewsletters(params),
    enabled: isAuthenticated,
    staleTime: NEWSLETTER_STALE_TIME_MS,
  });
}
