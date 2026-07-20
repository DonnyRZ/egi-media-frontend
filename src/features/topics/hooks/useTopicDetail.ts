"use client";

import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { getArticlesByTopicPage } from "@/shared/repositories/article.repository";
import { getTopicBySlug } from "@/shared/repositories/topic.repository";
import { toContentLocale } from "@/shared/utils/locale";

export function useTopicDetail(slug: string, page = 1) {
  const lang = toContentLocale(useLocale());

  const topicQuery = useQuery({
    queryKey: QUERY_KEYS.topics.list({ section: "detail", slug, lang }),
    queryFn: () => getTopicBySlug(slug, lang),
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
    enabled: Boolean(slug),
  });

  const articlesQuery = useQuery({
    queryKey: QUERY_KEYS.articles.list({
      section: "topic",
      topicId: topicQuery.data?.id,
      lang,
      page,
    }),
    queryFn: () => getArticlesByTopicPage(topicQuery.data!.id, lang, page),
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
    enabled: Boolean(topicQuery.data?.id),
  });

  return { topicQuery, articlesQuery };
}
