"use client";

import { useEffect, useMemo } from "react";

import { useArticleLocaleStore } from "@/shared/stores/article-locale.store";
import type { ArticleDetail, ContentLocale } from "@/shared/types/article.types";

interface ArticleLocaleShellProps {
  article: ArticleDetail;
  children: React.ReactNode;
}

function buildSlugAlternates(
  article: ArticleDetail,
): Partial<Record<ContentLocale, string>> {
  const alternates: Partial<Record<ContentLocale, string>> = {};

  for (const [locale, translation] of Object.entries(article.translations)) {
    if (translation?.slug) {
      alternates[locale as ContentLocale] = translation.slug;
    }
  }

  // Ensure the currently resolved locale slug is always present.
  alternates[article.locale] = article.slug;

  return alternates;
}

export function ArticleLocaleShell({ article, children }: ArticleLocaleShellProps) {
  const setSlugAlternates = useArticleLocaleStore((state) => state.setSlugAlternates);
  const clearSlugAlternates = useArticleLocaleStore((state) => state.clearSlugAlternates);
  const alternates = useMemo(() => buildSlugAlternates(article), [article]);

  useEffect(() => {
    setSlugAlternates(article.id, alternates,article.category?.id);
    // Do not clear on unmount — clearing races with the next article mount and
    // can leave LanguageSwitcher with stale alternates from another article.
    return () => {
      const current = useArticleLocaleStore.getState();
      if (current.articleId === article.id) {
        clearSlugAlternates();
      }
    };
  }, [article.id, article.category?.id, alternates, setSlugAlternates, clearSlugAlternates]);

  return <>{children}</>;
}
