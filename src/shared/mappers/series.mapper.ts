import type {
  Series,
  SeriesListResult,
  SeriesParentTopic,
} from "@/shared/types/series.types";
import { resolveImageUrl } from "@/shared/utils/image";

interface SeriesParentTopicDto {
  id: string;
  name: string;
  slug?: string | null;
}

interface SeriesDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  /** Shared across locales — one image for id/en/uz. */
  image?: string | null;
  article_count?: number;
  cover_image?: string | null;
  created_at?: string | null;
  topic_id?: string | null;
  topic?: SeriesParentTopicDto | null;
}

interface SeriesListResponseDto {
  items: SeriesDto[];
  meta: {
    total: number;
    page?: number;
    limit?: number;
    total_pages?: number;
  };
}

function mapParentTopic(
  dto: SeriesParentTopicDto | null | undefined,
  fallbackId?: string | null,
): SeriesParentTopic | null {
  const id = dto?.id ?? fallbackId ?? null;
  if (!id) return null;

  return {
    id,
    name: dto?.name ?? "Topic",
    slug: dto?.slug ?? id,
  };
}

export function mapSeriesDto(dto: SeriesDto): Series {
  // Prefer `image` (backend column); keep `cover_image` as legacy fallback.
  // Seed by series id so placeholder stays stable when locale/name changes.
  const rawImage = dto.image ?? dto.cover_image ?? null;
  const topicId = dto.topic_id ?? dto.topic?.id ?? null;

  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    articleCount: dto.article_count ?? 0,
    coverImage: resolveImageUrl(rawImage, dto.id),
    publishedAt: dto.created_at ?? null,
    topicId,
    topic: mapParentTopic(dto.topic, topicId),
  };
}

export function mapSeriesListDto(dto: SeriesListResponseDto): SeriesListResult {
  const total = dto.meta?.total ?? 0;
  const limit = dto.meta?.limit ?? dto.items?.length ?? 0;
  const page = dto.meta?.page ?? 1;

  return {
    items: (dto.items ?? []).map(mapSeriesDto),
    total,
    page,
    limit,
    totalPages:
      dto.meta?.total_pages ?? (limit > 0 ? Math.ceil(total / limit) : 0),
  };
}
