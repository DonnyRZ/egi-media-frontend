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

export function useNewsletterSubscriptions() {
  const userId = useAuthStore((state) => state.user?.id);
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);

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
      persist(optimistic);
      try {
        await (wasSubscribed
          ? unsubscribeNewsletter(id)
          : subscribeNewsletter(id));
      } catch {
        persist(subscribedIds);
      } finally {
        setPendingId(null);
      }
    },
    [userId, pendingId, subscribedIds, persist],
  );

  return {
    isSubscribed: (id: string) => subscribedIds.has(id),
    isPending: (id: string) => pendingId === id,
    toggle,
  };
}
