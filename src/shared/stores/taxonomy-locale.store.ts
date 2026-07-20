"use client";

import { create } from "zustand";

import type { ContentLocale } from "@/shared/types/article.types";

export type TaxonomySlugAlternates = Partial<Record<ContentLocale, string>>;

export type TaxonomyKind = "categories" | "topics";

interface TaxonomyLocaleState {
  kind: TaxonomyKind | null;
  entityId: string | null;
  slugAlternates: TaxonomySlugAlternates | null;
  setSlugAlternates: (
    kind: TaxonomyKind,
    entityId: string,
    alternates: TaxonomySlugAlternates,
  ) => void;
  clearSlugAlternates: () => void;
}

export const useTaxonomyLocaleStore = create<TaxonomyLocaleState>((set) => ({
  kind: null,
  entityId: null,
  slugAlternates: null,
  setSlugAlternates: (kind, entityId, slugAlternates) =>
    set({ kind, entityId, slugAlternates }),
  clearSlugAlternates: () =>
    set({ kind: null, entityId: null, slugAlternates: null }),
}));
