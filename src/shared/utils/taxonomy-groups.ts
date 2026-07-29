import type { Series, SeriesTopicGroup } from "@/shared/types/series.types";
import type { Topic, TopicCategoryGroup } from "@/shared/types/topic.types";

export function groupSeriesByTopic(items: Series[]): SeriesTopicGroup[] {
  const groups = new Map<string, SeriesTopicGroup>();
  const ungrouped: Series[] = [];

  for (const series of items) {
    const topic = series.topic;
    if (!topic) {
      ungrouped.push(series);
      continue;
    }

    const existing = groups.get(topic.id);
    if (existing) {
      existing.items.push(series);
    } else {
      groups.set(topic.id, { topic, items: [series] });
    }
  }

  const ordered = Array.from(groups.values()).sort((a, b) =>
    (a.topic?.name ?? "").localeCompare(b.topic?.name ?? ""),
  );

  if (ungrouped.length) {
    ordered.push({ topic: null, items: ungrouped });
  }

  return ordered;
}

export function groupTopicsByCategory(items: Topic[]): TopicCategoryGroup[] {
  const groups = new Map<string, TopicCategoryGroup>();
  const ungrouped: Topic[] = [];

  for (const topic of items) {
    const category = topic.category;
    if (!category) {
      ungrouped.push(topic);
      continue;
    }

    const existing = groups.get(category.id);
    if (existing) {
      existing.items.push(topic);
    } else {
      groups.set(category.id, { category, items: [topic] });
    }
  }

  const ordered = Array.from(groups.values()).sort((a, b) =>
    (a.category?.name ?? "").localeCompare(b.category?.name ?? ""),
  );

  if (ungrouped.length) {
    ordered.push({ category: null, items: ungrouped });
  }

  return ordered;
}
