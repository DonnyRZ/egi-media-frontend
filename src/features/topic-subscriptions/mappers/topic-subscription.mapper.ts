import type {
  MyTopicSubscriptionsResult,
  TopicCatalogResult,
  TopicSubscriptionCategory,
  TopicSubscriptionGroup,
  TopicSubscriptionItem,
} from "@/features/topic-subscriptions/types/topic-subscription.types";

interface CategoryDto {
  id: string;
  name: string;
  slug: string | null;
}

interface TopicDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  subscribed_at?: string | null;
  category: CategoryDto | null;
}

interface GroupDto {
  category: CategoryDto | null;
  topics: TopicDto[];
}

interface CatalogResponseDto {
  items: TopicDto[];
  groups: GroupDto[];
  meta: { total: number };
}

function mapCategory(dto: CategoryDto | null): TopicSubscriptionCategory | null {
  if (!dto) return null;
  return { id: dto.id, name: dto.name, slug: dto.slug };
}

function mapTopic(dto: TopicDto): TopicSubscriptionItem {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    category: mapCategory(dto.category),
    subscribedAt: dto.subscribed_at ?? null,
  };
}

function mapGroup(dto: GroupDto): TopicSubscriptionGroup {
  return {
    category: mapCategory(dto.category),
    topics: dto.topics.map(mapTopic),
  };
}

export function mapTopicCatalog(dto: CatalogResponseDto | null | undefined): TopicCatalogResult {
  const items = Array.isArray(dto?.items) ? dto.items.map(mapTopic) : [];
  const groups = Array.isArray(dto?.groups) ? dto.groups.map(mapGroup) : [];
  return {
    items,
    groups,
    total: dto?.meta?.total ?? items.length,
  };
}

export function mapMySubscriptions(
  dto: CatalogResponseDto | null | undefined,
): MyTopicSubscriptionsResult {
  const items = Array.isArray(dto?.items) ? dto.items.map(mapTopic) : [];
  const groups = Array.isArray(dto?.groups) ? dto.groups.map(mapGroup) : [];
  return {
    items,
    groups,
    total: dto?.meta?.total ?? items.length,
    subscribedIds: items.map((item) => item.id),
  };
}
