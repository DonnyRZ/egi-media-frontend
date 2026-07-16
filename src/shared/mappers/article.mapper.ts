import type { Article, ArticleListResult } from "@/shared/types/article.types";
import { calculateReadingTime } from "@/shared/utils/format";

interface ArticleAuthorDto {
  id: string;
  full_name: string;
}

interface ArticleCategoryDto {
  id: string;
  name: string;
}

export interface ArticleListItemDto {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  featured_image: string | null;
  published_at: string | null;
  author: ArticleAuthorDto;
  category: ArticleCategoryDto | null;
}

interface ArticleListResponseDto {
  items: ArticleListItemDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export function mapArticleDto(dto: ArticleListItemDto): Article {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    summary: dto.summary,
    featuredImage: dto.featured_image,
    publishedAt: dto.published_at,
    author: {
      id: dto.author.id,
      fullName: dto.author.full_name,
    },
    category: dto.category
      ? { id: dto.category.id, name: dto.category.name }
      : null,
    readingTimeMinutes: calculateReadingTime(dto.summary),
  };
}

export function mapArticleListDto(dto: ArticleListResponseDto): ArticleListResult {
  return {
    items: dto.items.map(mapArticleDto),
    total: dto.meta.total,
    page: dto.meta.page,
    limit: dto.meta.limit,
    totalPages: dto.meta.total_pages,
  };
}
