"use client";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { fetchArticles } from "@/shared/services/article.service";
import { fetchSeries } from "@/shared/services/series.service";
import { fetchColumns } from "@/features/columns/services/column.service";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { ColumnCard } from "@/features/columns/components/ColumnCard";
import { SeriesCard } from "@/features/series/components/SeriesCard";
import { ErrorState } from "@/shared/components/common/ErrorState";
import type { ContentLocale } from "@/shared/types/article.types";

export function TopicSection({
  topic,
}: {
  topic: { id: string; name: string; slug: string };
}) {
  const lang = useLocale() as ContentLocale;
  const articles = useQuery({
    queryKey: ["desk-topic", topic.id, lang],
    queryFn: () => fetchArticles({ topic_id: topic.id, lang, limit: 4 }),
  });
  if (articles.isError)
    return (
      <div className="p-5">
        <ErrorState onRetry={() => void articles.refetch()} />
      </div>
    );
  if ((articles.data?.items.length || 0) < 2) return null;
  return (
    <section className="border-t border-neutral-200 p-5">
      <h2 className="mb-4 text-xl font-bold">
        <Link href={`/topics/${topic.slug}`}>{topic.name} →</Link>
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {articles.data?.items.map((a) => (
          <ArticleCard key={a.id} article={a} variant="supporting" />
        ))}
      </div>
    </section>
  );
}
export function TopicSeries({ topicId }: { topicId: string }) {
  const lang = useLocale() as ContentLocale;
  const t = useTranslations("editorial");
  const series = useQuery({
    queryKey: ["desk-series", topicId, lang],
    queryFn: () => fetchSeries({ topic_id: topicId, lang, limit: 4 }),
  });
  const items = series.data?.items.filter((s) => s.articleCount > 0) || [];
  if (series.isError)
    return (
      <div className="p-5">
        <ErrorState onRetry={() => void series.refetch()} />
      </div>
    );
  if (!items.length) return null;
  return (
    <section className="border-t border-neutral-200 p-5">
      <h2 className="mb-4 text-xl font-bold">{t("series")}</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {items.map((s) => (
          <SeriesCard key={s.id} series={s} />
        ))}
      </div>
    </section>
  );
}
export function DeskColumns({ categoryId }: { categoryId: string }) {
  const lang = useLocale() as ContentLocale;
  const t = useTranslations("editorial");
  const columns = useQuery({
    queryKey: ["desk-columns", categoryId, lang],
    queryFn: () => fetchColumns({ category_id: categoryId, lang, limit: 3 }),
  });
  if (columns.isError)
    return (
      <div className="p-5">
        <ErrorState onRetry={() => void columns.refetch()} />
      </div>
    );
  if (!columns.data?.items.length) return null;
  return (
    <section className="border-t border-neutral-200 bg-primary-100/40 p-5">
      <h2 className="mb-4 text-xl font-bold">{t("columns")}</h2>
      {columns.data.items.map((c, i) => (
        <ColumnCard
          key={c.id}
          column={c}
          variant={i === 0 ? "featured" : "row"}
        />
      ))}
    </section>
  );
}
