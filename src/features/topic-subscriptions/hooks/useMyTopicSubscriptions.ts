"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { TOPIC_SUBSCRIPTION_STALE_TIME_MS } from "@/features/topic-subscriptions/constants/topic-subscription.constants";
import { fetchMyTopicSubscriptions } from "@/features/topic-subscriptions/services/topic-subscription.service";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import { toContentLocale } from "@/shared/utils/locale";

export function useMyTopicSubscriptions() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const lang = toContentLocale(useLocale());

  return useQuery({
    queryKey: QUERY_KEYS.topicSubscriptions.mine(lang),
    queryFn: () => fetchMyTopicSubscriptions(lang),
    enabled: isAuthenticated,
    staleTime: TOPIC_SUBSCRIPTION_STALE_TIME_MS,
  });
}
