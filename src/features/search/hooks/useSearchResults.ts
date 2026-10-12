"use client";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { fetchArticles } from "@/shared/services/article.service";
import { fetchColumns } from "@/features/columns/services/column.service";
import type { ContentLocale } from "@/shared/types/article.types";
export function useSearchResults(query: string, kind: "articles" | "columns") {
  const lang = useLocale() as ContentLocale;
  const page = Math.max(1, Number(useSearchParams().get(kind + "_page")) || 1);
  const params = { search: query, lang, page, limit: 12 };
  const articles = useQuery({
    queryKey: ["search", "articles", query, page, lang],
    queryFn: () => fetchArticles(params),
    enabled: kind === "articles",
  });
  const columns = useQuery({
    queryKey: ["search", "columns", query, page, lang],
    queryFn: () => fetchColumns(params),
    enabled: kind === "columns",
  });
  return {
    articles,
    columns,
    page,
    result: kind === "articles" ? articles : columns,
  };
}
