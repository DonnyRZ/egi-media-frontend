"use client";

import { useQuery } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  fetchTopicSubscribers,
  fetchTopicSubscriptionStats,
} from "@/features/cms/services/cms-subscription-stats.service";

export function useCmsTopicSubscriptionStats() {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.topicSubscriptions.stats,
    queryFn: fetchTopicSubscriptionStats,
    staleTime: 30_000,
  });
}

export function useCmsTopicSubscribers(topicId: string | null) {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.topicSubscriptions.subscribers(topicId ?? ""),
    queryFn: () => fetchTopicSubscribers(topicId!),
    enabled: Boolean(topicId),
    staleTime: 30_000,
  });
}
