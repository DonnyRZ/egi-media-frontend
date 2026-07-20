import type { Series, SeriesListResult } from "@/shared/types/series.types";

interface SeriesDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  article_count?: number;
  cover_image?: string | null;
  created_at?: string | null;
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

export function mapSeriesDto(dto: SeriesDto): Series {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    articleCount: dto.article_count ?? 0,
    coverImage: dto.cover_image ?? null,
    publishedAt: dto.created_at ?? null,
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
