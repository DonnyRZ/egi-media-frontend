"use client";

import { create } from "zustand";

import type { ContentLocale } from "@/shared/types/article.types";

export type ArticleSlugAlternates = Partial<Record<ContentLocale, string>>;

interface ArticleLocaleState {
  categoryId: string | null;
  articleId: string | null;
  slugAlternates: ArticleSlugAlternates | null;
  setSlugAlternates: (articleId: string, alternates: ArticleSlugAlternates, categoryId?:string|null) => void;
  clearSlugAlternates: () => void;
}

export const useArticleLocaleStore = create<ArticleLocaleState>((set) => ({
  categoryId:null,
  articleId: null,
  slugAlternates: null,
  setSlugAlternates: (articleId, slugAlternates, categoryId=null) => set({ articleId, slugAlternates,categoryId }),
  clearSlugAlternates: () => set({ articleId: null, slugAlternates: null,categoryId:null }),
}));
