"use client";

import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { getArticlesByCategoryPage } from "@/shared/repositories/article.repository";
import { getCategoryBySlug } from "@/shared/repositories/category.repository";
import { toContentLocale } from "@/shared/utils/locale";

export function useCategoryDetail(slug: string, page = 1) {
  const lang = toContentLocale(useLocale());

  const categoryQuery = useQuery({
    queryKey: QUERY_KEYS.categories.list({ section: "detail", slug }),
    queryFn: () => getCategoryBySlug(slug),
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
    enabled: Boolean(slug),
  });

  const articlesQuery = useQuery({
    queryKey: QUERY_KEYS.articles.list({
      section: "category",
      categoryId: categoryQuery.data?.id,
      lang,
      page,
    }),
    queryFn: () =>
      getArticlesByCategoryPage(categoryQuery.data!.id, lang, page),
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
    enabled: Boolean(categoryQuery.data?.id),
  });

  return { categoryQuery, articlesQuery };
}
