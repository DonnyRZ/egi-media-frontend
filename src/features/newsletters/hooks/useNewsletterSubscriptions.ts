"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
} from "@/features/newsletters/services/newsletter.service";
import {
  getSubscribedIds,
  saveSubscribedIds,
} from "@/features/newsletters/utils/subscription-storage";

interface SubscriptionError {
  id: string;
  message: string;
}

export function useNewsletterSubscriptions() {
  const userId = useAuthStore((state) => state.user?.id);
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<SubscriptionError | null>(null);

  useEffect(() => {
    setSubscribedIds(userId ? new Set(getSubscribedIds(userId)) : new Set());
  }, [userId]);

  const persist = useCallback(
    (next: Set<string>) => {
      setSubscribedIds(new Set(next));
      if (userId) saveSubscribedIds(userId, Array.from(next));
    },
    [userId],
  );

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
      persist(optimistic);
      try {
        await (wasSubscribed
          ? unsubscribeNewsletter(id)
          : subscribeNewsletter(id));
      } catch (caught) {
        persist(subscribedIds);
        const message = caught instanceof Error ? caught.message : "Request failed";
        setError({ id, message });
      } finally {
        setPendingId(null);
      }
    },
    [userId, pendingId, subscribedIds, persist],
  );

  return {
    isSubscribed: (id: string) => subscribedIds.has(id),
    isPending: (id: string) => pendingId === id,
    errorFor: (id: string) => (error?.id === id ? error.message : null),
    toggle,
  };
}
