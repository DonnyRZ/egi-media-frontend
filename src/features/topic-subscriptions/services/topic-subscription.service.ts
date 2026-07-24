import {
  ALREADY_SUBSCRIBED_STATUS,
  NOT_FOUND_STATUS,
  TOPIC_SUBSCRIPTION_ENDPOINTS,
} from "@/features/topic-subscriptions/constants/topic-subscription.constants";
import {
  mapMySubscriptions,
  mapTopicCatalog,
} from "@/features/topic-subscriptions/mappers/topic-subscription.mapper";
import type {
  MyTopicSubscriptionsResult,
  TopicCatalogResult,
} from "@/features/topic-subscriptions/types/topic-subscription.types";
import { axiosClient } from "@/shared/lib/axios-client";
import { ApiError } from "@/shared/lib/errors";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { ContentLocale } from "@/shared/types/article.types";

interface CatalogResponseDto {
  items: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    subscribed_at?: string | null;
    category: { id: string; name: string; slug: string | null } | null;
  }>;
  groups: Array<{
    category: { id: string; name: string; slug: string | null } | null;
    topics: Array<{
      id: string;
      name: string;
      slug: string;
      description: string | null;
      subscribed_at?: string | null;
      category: { id: string; name: string; slug: string | null } | null;
    }>;
  }>;
  meta: { total: number };
}

export async function fetchTopicCatalog(
  lang: ContentLocale = "id",
): Promise<TopicCatalogResult> {
  const response = await axiosClient.get<ApiSuccessResponse<CatalogResponseDto>>(
    TOPIC_SUBSCRIPTION_ENDPOINTS.catalog,
    { params: { lang } },
  );
  return mapTopicCatalog(response.data?.data);
}

export async function fetchMyTopicSubscriptions(
  lang: ContentLocale = "id",
): Promise<MyTopicSubscriptionsResult> {
  try {
    const response = await axiosClient.get<ApiSuccessResponse<CatalogResponseDto>>(
      TOPIC_SUBSCRIPTION_ENDPOINTS.myTopics,
      { params: { lang } },
    );
    return mapMySubscriptions(response.data?.data);
  } catch {
    // Keep the settings page usable if subscriptions fail; default to none selected.
    return mapMySubscriptions({ items: [], groups: [], meta: { total: 0 } });
  }
}

export async function subscribeTopic(id: string): Promise<void> {
  try {
    await axiosClient.post(TOPIC_SUBSCRIPTION_ENDPOINTS.subscribe(id));
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === ALREADY_SUBSCRIBED_STATUS) {
      return;
    }
    throw error;
  }
}

export async function unsubscribeTopic(id: string): Promise<void> {
  try {
    await axiosClient.delete(TOPIC_SUBSCRIPTION_ENDPOINTS.subscribe(id));
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === NOT_FOUND_STATUS) {
      return;
    }
    throw error;
  }
}
