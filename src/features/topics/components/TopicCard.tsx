"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { Topic } from "@/shared/types/topic.types";

interface TopicCardProps {
  topic: Topic;
  variant?: "default" | "featured";
}

export function TopicCard({ topic, variant = "default" }: TopicCardProps) {
  const t = useTranslations("topicsPage");

  if (variant === "featured") {
    return (
      <article className="group border-b border-neutral-200 pb-8 lg:pb-10">
        <p className="kicker">{t("featuredKicker")}</p>
        <h2 className="mt-3 font-sans text-3xl font-bold leading-tight text-ink transition-colors group-hover:text-accent sm:text-4xl">
          <Link href={`/topics/${topic.slug}`}>{topic.name}</Link>
        </h2>
        {topic.description ? (
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
            {topic.description}
          </p>
        ) : null}
        <Link
          className="mt-5 inline-flex text-sm font-semibold text-primary-700 transition-colors hover:text-accent"
          href={`/topics/${topic.slug}`}
        >
          {t("browseTopic")} →
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col p-5">
      <p className="kicker">{t("kicker")}</p>
      <h3 className="mt-2 font-sans text-xl font-bold leading-snug text-ink transition-colors group-hover:text-accent">
        <Link href={`/topics/${topic.slug}`}>{topic.name}</Link>
      </h3>
      {topic.description ? (
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-neutral-600">
          {topic.description}
        </p>
      ) : null}
      <Link
        className="mt-4 inline-flex text-sm font-semibold text-primary-700 transition-colors hover:text-accent"
        href={`/topics/${topic.slug}`}
      >
        {t("browseTopic")} →
      </Link>
    </article>
  );
}
