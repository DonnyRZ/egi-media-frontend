"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  saveArticle,
  unsaveArticle,
} from "@/features/saved-articles/services/saved-article.service";
import {
  getSavedIds,
  saveSavedIds,
} from "@/features/saved-articles/utils/saved-storage";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useSaveArticle(articleId: string) {
  const userId = useAuthStore((state) => state.user?.id);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSaved(userId ? getSavedIds(userId).includes(articleId) : false);
  }, [userId, articleId]);

  const persist = useCallback(
    (nextSaved: boolean) => {
      if (!userId) return;
      const ids = new Set(getSavedIds(userId));
      if (nextSaved) {
        ids.add(articleId);
      } else {
        ids.delete(articleId);
      }
      saveSavedIds(userId, Array.from(ids));
    },
    [userId, articleId],
  );

  const apply = useCallback(
    async (nextSaved: boolean) => {
      if (!userId || isPending) return;
      const previous = isSaved;
      setIsSaved(nextSaved);
      setIsPending(true);
      setError(null);
      persist(nextSaved);
      try {
        await (nextSaved ? saveArticle(articleId) : unsaveArticle(articleId));
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.savedArticles.all,
        });
      } catch (caught) {
        setIsSaved(previous);
        persist(previous);
        setError(caught instanceof Error ? caught.message : "Request failed");
      } finally {
        setIsPending(false);
      }
    },
    [userId, isPending, isSaved, articleId, persist, queryClient],
  );

  const toggle = useCallback(() => apply(!isSaved), [apply, isSaved]);
  const remove = useCallback(() => apply(false), [apply]);

  return {
    isSaved,
    isPending,
    error,
    toggle,
    remove,
    canSave: isAuthenticated,
  };
}
