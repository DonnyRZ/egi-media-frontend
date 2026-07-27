import { useMemo } from "react";

import type { Option } from "@/features/cms/components/ui/MultiSelect";
import type { CmsTaxonomyItem } from "@/features/cms/services/cms-taxonomy.service";

export interface TopicOption extends Option {
  categoryId: string | null;
}

export interface SeriesOption extends Option {
  topicId: string | null;
}

export function toCategoryOptions(items: CmsTaxonomyItem[]): Option[] {
  return items.map((item) => ({ value: item.id, label: item.name }));
}

export function toTopicOptions(items: CmsTaxonomyItem[]): TopicOption[] {
  return items.map((item) => ({
    value: item.id,
    label: item.name,
    categoryId: item.categoryId,
  }));
}

export function toSeriesOptions(items: CmsTaxonomyItem[]): SeriesOption[] {
  return items.map((item) => ({
    value: item.id,
    label: item.name,
    topicId: item.topicId,
  }));
}

export function toTagOptions(items: CmsTaxonomyItem[]): Option[] {
  return items.map((item) => ({ value: item.id, label: item.name }));
}

export function useCascadingTaxonomyOptions(params: {
  categoryId: string | undefined;
  topicId: string | undefined;
  topics: TopicOption[];
  series: SeriesOption[];
}) {
  const { categoryId, topicId, topics, series } = params;
  const hasCategory = Boolean(categoryId);
  const hasTopic = Boolean(topicId);

  const filteredTopics = useMemo(() => {
    if (!categoryId) return [];
    return topics.filter((topic) => topic.categoryId === categoryId);
  }, [topics, categoryId]);

  const filteredSeries = useMemo(() => {
    if (!topicId) return [];
    return series.filter((item) => item.topicId === topicId);
  }, [series, topicId]);

  return {
    hasCategory,
    hasTopic,
    filteredTopics,
    filteredSeries,
    topicsDisabled: !hasCategory,
    seriesDisabled: !hasCategory || !hasTopic,
  };
}
