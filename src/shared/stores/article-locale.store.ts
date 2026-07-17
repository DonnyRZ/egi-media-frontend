"use client";

import { create } from "zustand";

import type { ContentLocale } from "@/shared/types/article.types";

export type ArticleSlugAlternates = Partial<Record<ContentLocale, string>>;

interface ArticleLocaleState {
  articleId: string | null;
  slugAlternates: ArticleSlugAlternates | null;
  setSlugAlternates: (articleId: string, alternates: ArticleSlugAlternates) => void;
  clearSlugAlternates: () => void;
}

export const useArticleLocaleStore = create<ArticleLocaleState>((set) => ({
  articleId: null,
  slugAlternates: null,
  setSlugAlternates: (articleId, slugAlternates) => set({ articleId, slugAlternates }),
  clearSlugAlternates: () => set({ articleId: null, slugAlternates: null }),
}));
