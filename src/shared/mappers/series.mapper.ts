import type { Series, SeriesListResult } from "@/shared/types/series.types";

interface SeriesDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  article_count?: number;
  cover_image?: string | null;
}

interface SeriesListResponseDto {
  items: SeriesDto[];
  meta: { total: number };
}

export function mapSeriesDto(dto: SeriesDto): Series {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    articleCount: dto.article_count ?? 0,
    coverImage: dto.cover_image ?? null,
  };
}

export function mapSeriesListDto(dto: SeriesListResponseDto): SeriesListResult {
  return {
    items: (dto.items ?? []).map(mapSeriesDto),
    total: dto.meta?.total ?? 0,
  };
}
