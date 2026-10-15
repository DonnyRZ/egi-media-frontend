import type {
  Article,
  ArticleDetail,
  ArticleListResult,
  ArticleTranslation,
  ContentLocale,
} from "@/shared/types/article.types";
import { calculateReadingTime } from "@/shared/utils/format";
import { resolveImageUrl } from "@/shared/utils/image";
import { PUBLIC_ARTICLE_AUTHOR_NAME } from "@/shared/constants/article.constants";

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
  reading_time_minutes?: number | null;
  featured_image: string | null;
  featured_image_alt?: string | null;
  featured_image_caption?: string | null;
  featured_image_credit?: string | null;

  published_at: string | null;
  author: ArticleAuthorDto;
  category: ArticleCategoryDto | null;
  locale?: ContentLocale;
  available_locales?: ContentLocale[];
  headline_position?: number | null;
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
    featuredImageAlt: dto.featured_image_alt || null,
    featuredImageCaption: dto.featured_image_caption || null,
    featuredImageCredit: dto.featured_image_credit || null,
    publishedAt: dto.published_at,
    author: {
      id: dto.author.id,
      fullName: PUBLIC_ARTICLE_AUTHOR_NAME,
    },
    category: dto.category
      ? { id: dto.category.id, name: dto.category.name }
      : null,
    readingTimeMinutes: typeof dto.reading_time_minutes === "number" && Number.isFinite(dto.reading_time_minutes) && dto.reading_time_minutes > 0
      ? Math.ceil(dto.reading_time_minutes) : null,
    locale: dto.locale ?? "id",
    availableLocales: dto.available_locales ?? ["id"],
    headlinePosition:
      typeof dto.headline_position === "number" ? dto.headline_position : null,
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
    readingTimeMinutes: base.readingTimeMinutes ?? calculateReadingTime(dto.content),
    defaultLocale: dto.default_locale ?? "id",
    requestedLocale: dto.requested_locale ?? base.locale,
    translations,
  };
}

export function mapArticleListDto(
  dto: ArticleListResponseDto | null | undefined,
): ArticleListResult {
  const items = dto?.items ?? [];
  const meta = dto?.meta;

  return {
    items: items.map(mapArticleDto),
    total: meta?.total ?? items.length,
    page: meta?.page ?? 1,
    limit: meta?.limit ?? items.length,
    totalPages: meta?.total_pages ?? 1,
  };
}
