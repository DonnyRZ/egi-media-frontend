import type { YoutubeVideo, YoutubeVideoListResult } from "@/shared/types/youtube.types";
import { getYoutubeThumbnail } from "@/shared/utils/format";

interface YoutubeVideoDto {
  id: string;
  title: string;
  description: string | null;
  url: string;
  duration?: string | null;
  created_at?: string | null;
}

interface YoutubeVideoListResponseDto {
  items: YoutubeVideoDto[];
  meta: {
    total: number;
    page?: number;
    limit?: number;
    total_pages?: number;
  };
}

export function mapYoutubeVideoDto(dto: YoutubeVideoDto): YoutubeVideo {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    url: dto.url,
    thumbnailUrl: getYoutubeThumbnail(dto.url),
    durationLabel: dto.duration ?? null,
    publishedAt: dto.created_at ?? null,
  };
}

export function mapYoutubeVideoListDto(
  dto: YoutubeVideoListResponseDto,
): YoutubeVideoListResult {
  const total = dto.meta?.total ?? 0;
  const limit = dto.meta?.limit ?? dto.items?.length ?? 0;
  const page = dto.meta?.page ?? 1;

  return {
    items: (dto.items ?? []).map(mapYoutubeVideoDto),
    total,
    page,
    limit,
    totalPages: dto.meta?.total_pages ?? (limit > 0 ? Math.ceil(total / limit) : 0),
  };
}
