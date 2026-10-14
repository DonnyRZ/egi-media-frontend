"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchCategoryTranslationState,
  retryCategoryTranslation,
  type CategoryTranslationLocale,
  type CmsCategoryTranslationState,
} from "@/features/cms/services/cms-taxonomy.service";

export function useCategoryTranslations(pollCategoryId?: string) {
  const [state, setState] = useState<CmsCategoryTranslationState | null>(null);
  const [retryingLocale, setRetryingLocale] = useState<CategoryTranslationLocale | null>(null);

  const load = useCallback(async (categoryId: string) => {
    const next = await fetchCategoryTranslationState(categoryId);
    setState(next);
    return next;
  }, []);

  const clear = useCallback(() => setState(null), []);

  const retry = useCallback(async (categoryId: string, locale: CategoryTranslationLocale) => {
    setRetryingLocale(locale);
    try {
      const result = await retryCategoryTranslation(categoryId, locale);
      const latest = await fetchCategoryTranslationState(categoryId);
      setState(latest);
      return { ...result, latest };
    } finally {
      setRetryingLocale(null);
    }
  }, []);

  const statusKey = `${state?.locales.en.status ?? ""}:${state?.locales.uz.status ?? ""}`;
  useEffect(() => {
    const isTranslating = [state?.locales.en.status, state?.locales.uz.status]
      .some((status) => status === "pending" || status === "processing");
    if (!pollCategoryId || state?.categoryId !== pollCategoryId || !isTranslating) return;
    let cancelled = false;
    const timer = window.setInterval(() => {
      void fetchCategoryTranslationState(pollCategoryId)
        .then((next) => { if (!cancelled) setState(next); })
        .catch(() => undefined);
    }, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  // Poll only while this category has an active translation job.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollCategoryId, statusKey]);

  return { state, retryingLocale, load, retry, clear };
}
