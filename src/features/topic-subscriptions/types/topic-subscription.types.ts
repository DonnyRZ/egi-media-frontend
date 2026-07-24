export interface TopicSubscriptionCategory {
  id: string;
  name: string;
  slug: string | null;
}

export interface TopicSubscriptionItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: TopicSubscriptionCategory | null;
  subscribedAt: string | null;
}

export interface TopicSubscriptionGroup {
  category: TopicSubscriptionCategory | null;
  topics: TopicSubscriptionItem[];
}

export interface TopicCatalogResult {
  items: TopicSubscriptionItem[];
  groups: TopicSubscriptionGroup[];
  total: number;
}

export interface MyTopicSubscriptionsResult {
  items: TopicSubscriptionItem[];
  groups: TopicSubscriptionGroup[];
  total: number;
  subscribedIds: string[];
}
