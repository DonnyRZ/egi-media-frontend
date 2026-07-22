"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  saveColumnEntry,
  unsaveColumnEntry,
} from "@/features/columns/repositories/column.repository";
import {
  getSavedColumnIds,
  saveSavedColumnIds,
} from "@/features/columns/utils/saved-column-storage";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useSaveColumn(columnId: string) {
  const userId = useAuthStore((state) => state.user?.id);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSaved(userId ? getSavedColumnIds(userId).includes(columnId) : false);
  }, [userId, columnId]);

  const persist = useCallback(
    (nextSaved: boolean) => {
      if (!userId) return;
      const ids = new Set(getSavedColumnIds(userId));
      if (nextSaved) {
        ids.add(columnId);
      } else {
        ids.delete(columnId);
      }
      saveSavedColumnIds(userId, Array.from(ids));
    },
    [userId, columnId],
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
        await (nextSaved
          ? saveColumnEntry(columnId)
          : unsaveColumnEntry(columnId));
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.savedColumns.all,
        });
      } catch (caught) {
        setIsSaved(previous);
        persist(previous);
        setError(caught instanceof Error ? caught.message : "Request failed");
      } finally {
        setIsPending(false);
      }
    },
    [userId, isPending, isSaved, columnId, persist, queryClient],
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
