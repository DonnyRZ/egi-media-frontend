import type { Topic, TopicListResult } from "@/shared/types/topic.types";

interface TopicDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface TopicListResponseDto {
  items: TopicDto[];
  meta: { total: number };
}

export function mapTopicDto(dto: TopicDto): Topic {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
  };
}

export function mapTopicListDto(dto: TopicListResponseDto): TopicListResult {
  return {
    items: (dto.items ?? []).map(mapTopicDto),
    total: dto.meta?.total ?? 0,
  };
}
