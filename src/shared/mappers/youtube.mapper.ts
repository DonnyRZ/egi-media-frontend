import type { YoutubeVideo, YoutubeVideoListResult } from "@/shared/types/youtube.types";
import { getYoutubeThumbnail } from "@/shared/utils/format";

interface YoutubeVideoDto {
  id: string;
  title: string;
  description: string | null;
  url: string;
  duration?: string | null;
}

interface YoutubeVideoListResponseDto {
  items: YoutubeVideoDto[];
  meta: { total: number };
}

export function mapYoutubeVideoDto(dto: YoutubeVideoDto): YoutubeVideo {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    url: dto.url,
    thumbnailUrl: getYoutubeThumbnail(dto.url),
    durationLabel: dto.duration ?? null,
  };
}

export function mapYoutubeVideoListDto(
  dto: YoutubeVideoListResponseDto,
): YoutubeVideoListResult {
  return {
    items: dto.items.map(mapYoutubeVideoDto),
    total: dto.meta.total,
  };
}
