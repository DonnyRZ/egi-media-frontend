import { NEWS_FEED_SOURCE_LABELS } from "@/features/cms/constants/news-feed.constants";
import type { CrawledArticle } from "@/features/cms/types/news-feed.types";

export interface CrawledArticleDto {
  article_id?: string;
  title?: string;
  summary?: string;
  content?: string;
  featured_image?: string;
  published_at?: string;
  author_name?: string;
  source_url?: string;
  category?: string;
  tags?: string[];
  language?: string;
  source_id?: string;
  collected_at?: string;
}

export function mapCrawledArticle(dto: CrawledArticleDto): CrawledArticle {
  const sourceId = dto.source_id ?? "unknown";
  return {
    id: dto.article_id ?? `${sourceId}-${dto.source_url ?? dto.title ?? "item"}`,
    title: dto.title ?? "Untitled",
    summary: dto.summary ?? null,
    content: dto.content ?? null,
    featuredImage: dto.featured_image ?? null,
    publishedAt: dto.published_at ?? null,
    authorName: dto.author_name ?? null,
    sourceUrl: dto.source_url ?? null,
    category: dto.category ?? null,
    tags: Array.isArray(dto.tags) ? dto.tags : [],
    language: dto.language ?? null,
    sourceId,
    sourceLabel: NEWS_FEED_SOURCE_LABELS[sourceId] ?? sourceId,
    collectedAt: dto.collected_at ?? null,
  };
}
