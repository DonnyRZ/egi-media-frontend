import type { YoutubeVideo, YoutubeVideoListResult } from "@/shared/types/youtube.types";
import { getYoutubeThumbnail } from "@/shared/utils/format";

interface YoutubeVideoDto {
  id: string;
  title: string;
  description: string | null;
  url: string;
  duration?: string | null;
  format?: "horizontal" | "short";
  poster_landscape?: string | null;
  poster_portrait?: string | null;
  duration_seconds?: number | null;
  category_id?: string | null;
  program_id?: string | null;
  episode_number?: number | null;
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
    thumbnailUrl: (dto.format === "short" ? dto.poster_portrait : dto.poster_landscape) || getYoutubeThumbnail(dto.url),
    format: dto.format || "horizontal",
    posterLandscape: dto.poster_landscape || null,
    posterPortrait: dto.poster_portrait || null,
    categoryId: dto.category_id || null,
    programId: dto.program_id || null,
    episodeNumber: dto.episode_number || null,
    durationLabel: dto.duration_seconds ? `${Math.floor(dto.duration_seconds / 60)}:${String(dto.duration_seconds % 60).padStart(2, "0")}` : dto.duration ?? null,
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
