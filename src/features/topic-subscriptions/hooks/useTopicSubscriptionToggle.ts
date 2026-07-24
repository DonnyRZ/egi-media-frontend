"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useMyTopicSubscriptions } from "@/features/topic-subscriptions/hooks/useMyTopicSubscriptions";
import {
  subscribeTopic,
  unsubscribeTopic,
} from "@/features/topic-subscriptions/services/topic-subscription.service";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

interface SubscriptionError {
  id: string;
  message: string;
}

export function useTopicSubscriptionToggle() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  const { data } = useMyTopicSubscriptions();
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<SubscriptionError | null>(null);

  useEffect(() => {
    setSubscribedIds(new Set(data?.subscribedIds ?? []));
  }, [data?.subscribedIds]);

  const invalidate = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.topicSubscriptions.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.personalizedFeed.all }),
    ]);
  }, [queryClient]);

  const toggle = useCallback(
    async (id: string) => {
      if (!userId || pendingId) return;
      const wasSubscribed = subscribedIds.has(id);
      const optimistic = new Set(subscribedIds);
      if (wasSubscribed) {
        optimistic.delete(id);
      } else {
        optimistic.add(id);
      }
      setPendingId(id);
      setError(null);
      setSubscribedIds(optimistic);
      try {
        await (wasSubscribed ? unsubscribeTopic(id) : subscribeTopic(id));
        await invalidate();
      } catch (caught) {
        setSubscribedIds(subscribedIds);
        const message = caught instanceof Error ? caught.message : "Request failed";
        setError({ id, message });
      } finally {
        setPendingId(null);
      }
    },
    [userId, pendingId, subscribedIds, invalidate],
  );

  return {
    isSubscribed: (id: string) => subscribedIds.has(id),
    isPending: (id: string) => pendingId === id,
    errorFor: (id: string) => (error?.id === id ? error.message : null),
    subscribedCount: subscribedIds.size,
    toggle,
  };
}
