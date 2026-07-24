import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse } from "@/shared/types/api.types";

export interface TopicSubscriptionStat {
  topicId: string;
  topicName: string;
  topicSlug: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  subscriberCount: number;
}

export interface TopicSubscriptionStatsResult {
  items: TopicSubscriptionStat[];
  totalTopics: number;
  totalSubscribers: number;
}

export interface TopicSubscriber {
  userId: string;
  email: string;
  fullName: string | null;
  role: string;
  subscribedAt: string | null;
}

export interface TopicSubscribersResult {
  topic: { id: string; name: string; slug: string | null };
  items: TopicSubscriber[];
  total: number;
}

interface StatsDto {
  items: Array<{
    topic_id: string;
    topic_name: string;
    topic_slug: string | null;
    category_id: string | null;
    category_name: string | null;
    category_slug: string | null;
    subscriber_count: number;
  }>;
  meta: { total_topics: number; total_subscribers: number };
}

interface SubscribersDto {
  topic: { id: string; name: string; slug: string | null };
  items: Array<{
    user_id: string;
    email: string;
    full_name: string | null;
    role: string;
    subscribed_at: string | null;
  }>;
  meta: { total: number };
}

export async function fetchTopicSubscriptionStats(): Promise<TopicSubscriptionStatsResult> {
  const response = await axiosClient.get<ApiSuccessResponse<StatsDto>>(
    API_ENDPOINTS.subscriptionStats,
  );
  const data = response.data.data;
  return {
    items: (data?.items ?? []).map((item) => ({
      topicId: item.topic_id,
      topicName: item.topic_name,
      topicSlug: item.topic_slug,
      categoryId: item.category_id,
      categoryName: item.category_name,
      categorySlug: item.category_slug,
      subscriberCount: item.subscriber_count ?? 0,
    })),
    totalTopics: data?.meta?.total_topics ?? 0,
    totalSubscribers: data?.meta?.total_subscribers ?? 0,
  };
}

export async function fetchTopicSubscribers(
  topicId: string,
): Promise<TopicSubscribersResult> {
  const response = await axiosClient.get<ApiSuccessResponse<SubscribersDto>>(
    API_ENDPOINTS.topicSubscribers(topicId),
  );
  const data = response.data.data;
  return {
    topic: {
      id: data.topic.id,
      name: data.topic.name,
      slug: data.topic.slug,
    },
    items: (data.items ?? []).map((item) => ({
      userId: item.user_id,
      email: item.email,
      fullName: item.full_name,
      role: item.role,
      subscribedAt: item.subscribed_at,
    })),
    total: data.meta?.total ?? 0,
  };
}
