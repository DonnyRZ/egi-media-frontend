"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { TOPIC_SUBSCRIPTION_STALE_TIME_MS } from "@/features/topic-subscriptions/constants/topic-subscription.constants";
import { fetchTopicCatalog } from "@/features/topic-subscriptions/services/topic-subscription.service";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import { toContentLocale } from "@/shared/utils/locale";

export function useTopicCatalog() {
  const lang = toContentLocale(useLocale());

  return useQuery({
    queryKey: QUERY_KEYS.topicSubscriptions.catalog(lang),
    queryFn: () => fetchTopicCatalog(lang),
    staleTime: TOPIC_SUBSCRIPTION_STALE_TIME_MS,
  });
}
