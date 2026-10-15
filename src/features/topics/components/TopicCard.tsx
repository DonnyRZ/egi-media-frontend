"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";
import type { Topic } from "@/shared/types/topic.types";

interface TopicCardProps {
  topic: Topic;
  variant?: "default" | "featured";
  className?: string;
}

export function TopicCard({ topic, variant = "default", className }: TopicCardProps) {
  const t = useTranslations("topicsPage");

  if (variant === "featured") {
    return (
      <article className={cn("editorial-card group border-b border-neutral-200 pb-8 lg:pb-10", className)}>
        <p className="kicker">{t("featuredKicker")}</p>
        <h2 className="editorial-lead-title mt-3 font-sans text-3xl font-bold leading-tight text-ink transition-colors group-hover:text-accent sm:text-4xl">
          <Link href={`/topics/${topic.slug}`}>{topic.name}</Link>
        </h2>
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
    <article className={cn("editorial-card editorial-gutter group flex h-full flex-col px-4 py-5 md:p-5", className)}>
      <p className="kicker">{t("kicker")}</p>
      <h3 className="editorial-card-title mt-2 font-sans text-xl font-bold leading-snug text-ink transition-colors group-hover:text-accent">
        <Link href={`/topics/${topic.slug}`}>{topic.name}</Link>
      </h3>
      <Link
        className="mt-4 inline-flex text-sm font-semibold text-primary-700 transition-colors hover:text-accent"
        href={`/topics/${topic.slug}`}
      >
        {t("browseTopic")} →
      </Link>
    </article>
  );
}
