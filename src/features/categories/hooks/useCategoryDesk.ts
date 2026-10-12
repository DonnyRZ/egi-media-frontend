"use client";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { fetchCategoryEditorialSelection } from "@/shared/services/editorial.service";
import { fetchYoutubeVideos } from "@/shared/services/youtube.service";
import { selectCategoryPackage } from "@/shared/utils/category-selection";
import type { Article, ContentLocale } from "@/shared/types/article.types";
export function useCategoryDesk(categoryId: string, articles: Article[]) {
  const lang = useLocale() as ContentLocale;
  const selection = useQuery({
    queryKey: ["category-editorial", categoryId, lang],
    queryFn: () => fetchCategoryEditorialSelection(categoryId, lang, articles),
  });
  const videos = useQuery({
    queryKey: ["category-videos", categoryId, lang],
    queryFn: () =>
      fetchYoutubeVideos({
        category_id: categoryId,
        format: "horizontal",
        limit: 1,
        lang,
      }),
  });
  const config = selection.data?.config;
  const content = selectCategoryPackage(
    categoryId,
    articles,
    selection.data?.selected || articles,
    config,
  );
  return { selection, videos, config, ...content };
}
