import type {
  Article,
  ArticleDetail,
  ArticleListResult,
  ArticleTranslation,
  ContentLocale,
} from "@/shared/types/article.types";
import { calculateReadingTime } from "@/shared/utils/format";
import { resolveImageUrl } from "@/shared/utils/image";

interface ArticleAuthorDto {
  id: string;
  full_name: string;
}

interface ArticleCategoryDto {
  id: string;
  name: string;
}

interface ArticleTranslationDto {
  title: string;
  slug: string | null;
  summary: string | null;
  content: string | null;
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
  locale?: ContentLocale;
  available_locales?: ContentLocale[];
}

export interface ArticleDetailDto extends ArticleListItemDto {
  content: string;
  view_count?: number;
  share_count?: number;
  default_locale?: ContentLocale;
  requested_locale?: ContentLocale;
  translations?: Partial<Record<ContentLocale, ArticleTranslationDto>>;
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

function mapTranslation(dto: ArticleTranslationDto): ArticleTranslation {
  return {
    title: dto.title,
    slug: dto.slug,
    summary: dto.summary,
    content: dto.content,
  };
}

export function mapArticleDto(dto: ArticleListItemDto): Article {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    summary: dto.summary,
    // Seed by article id so placeholder image stays stable across locales.
    featuredImage: resolveImageUrl(dto.featured_image, dto.id),
    publishedAt: dto.published_at,
    author: {
      id: dto.author.id,
      fullName: dto.author.full_name,
    },
    category: dto.category
      ? { id: dto.category.id, name: dto.category.name }
      : null,
    readingTimeMinutes: calculateReadingTime(dto.summary),
    locale: dto.locale ?? "id",
    availableLocales: dto.available_locales ?? ["id"],
  };
}

export function mapArticleDetailDto(dto: ArticleDetailDto): ArticleDetail {
  const base = mapArticleDto(dto);
  const translations = Object.fromEntries(
    Object.entries(dto.translations ?? {}).map(([locale, value]) => [
      locale,
      mapTranslation(value),
    ]),
  ) as Partial<Record<ContentLocale, ArticleTranslation>>;

  return {
    ...base,
    content: dto.content,
    viewCount: dto.view_count ?? 0,
    shareCount: dto.share_count ?? 0,
    readingTimeMinutes: calculateReadingTime(dto.content || dto.summary),
    defaultLocale: dto.default_locale ?? "id",
    requestedLocale: dto.requested_locale ?? base.locale,
    translations,
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
