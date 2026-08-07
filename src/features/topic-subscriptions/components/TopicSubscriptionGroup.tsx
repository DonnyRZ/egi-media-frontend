"use client";

import { useTranslations } from "next-intl";

import { TopicSubscribeToggle } from "@/features/topic-subscriptions/components/TopicSubscribeToggle";
import type { TopicSubscriptionGroup } from "@/features/topic-subscriptions/types/topic-subscription.types";

interface TopicSubscriptionGroupProps {
  group: TopicSubscriptionGroup;
  isSubscribed: (id: string) => boolean;
  isPending: (id: string) => boolean;
  errorFor: (id: string) => string | null;
  onToggle: (id: string) => void;
}

export function TopicSubscriptionGroupBlock({
  group,
  isSubscribed,
  isPending,
  errorFor,
  onToggle,
}: TopicSubscriptionGroupProps) {
  const t = useTranslations("topicSubscriptionsPage");
  const heading = group.category?.name ?? t("uncategorized");

  return (
    <section aria-labelledby={`topic-group-${group.category?.id ?? "other"}`}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <h3
          className="font-serif text-xl font-bold text-ink"
          id={`topic-group-${group.category?.id ?? "other"}`}
        >
          {heading}
        </h3>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {t("topicCount", { count: group.topics.length })}
        </p>
      </div>

      <ul className="divide-y divide-neutral-200 border border-neutral-200">
        {group.topics.map((topic) => (
          <li
            className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            key={topic.id}
          >
            <div className="min-w-0">
              <p className="font-semibold text-ink">{topic.name}</p>
              {topic.description ? (
                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  {topic.description}
                </p>
              ) : null}
              {errorFor(topic.id) ? (
                <p className="mt-1 text-sm text-red-600">{errorFor(topic.id)}</p>
              ) : null}
            </div>
            <TopicSubscribeToggle
              isPending={isPending(topic.id)}
              isSubscribed={isSubscribed(topic.id)}
              onToggle={() => onToggle(topic.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
