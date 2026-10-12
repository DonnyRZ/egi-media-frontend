"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  DeskColumns,
  TopicSection,
  TopicSeries,
} from "@/features/categories/components/DeskSections";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { ArticleTimeline } from "@/shared/components/common/ArticleTimeline";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import type { useCategoryDesk } from "@/features/categories/hooks/useCategoryDesk";
interface DeskPartProps {
  model: ReturnType<typeof useCategoryDesk>;
}
export function DeskTopicNavigation({ model }: DeskPartProps) {
  const t = useTranslations("editorial");
  if (!model.config?.topics.length) return null;
  return (
    <nav
      aria-label={t("topics")}
      className="flex gap-6 overflow-x-auto border-b border-neutral-200 px-5 py-4"
    >
      {model.config.topics.map((topic) => (
        <Link
          key={topic.id}
          href={`/topics/${topic.slug}`}
          className="shrink-0 text-sm font-medium hover:underline"
        >
          {topic.name}
        </Link>
      ))}
    </nav>
  );
}
export function DeskNotices({ model }: DeskPartProps) {
  return (
    <>
      {model.selection.isError ? (
        <div className="p-5">
          <ErrorState onRetry={() => void model.selection.refetch()} />
        </div>
      ) : null}
      {model.videos.isError ? (
        <div className="p-5">
          <ErrorState onRetry={() => void model.videos.refetch()} />
        </div>
      ) : null}
    </>
  );
}
export function DeskEditorPicks({ model }: DeskPartProps) {
  const t = useTranslations("editorial");
  if (!model.editors.length) return null;
  return (
    <section className="border-t border-neutral-200 p-5">
      <h2 className="mb-4 text-xl font-bold">{t("editors")}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {model.editors.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="supporting"
          />
        ))}
      </div>
    </section>
  );
}
export function DeskCompactStories({ model }: DeskPartProps) {
  if (model.rest.length <= 6) return null;
  return (
    <div className="grid gap-5 border-t border-neutral-200 p-5 sm:grid-cols-2 lg:grid-cols-3">
      {model.rest.slice(6, 12).map((article) => (
        <ArticleCard key={article.id} article={article} variant="supporting" />
      ))}
    </div>
  );
}
export function DeskRelatedSections({
  model,
  categoryId,
}: DeskPartProps & { categoryId: string }) {
  return (
    <>
      <DeskColumns categoryId={categoryId} />
      {model.config?.topics.slice(0, 8).map((topic) => (
        <div key={topic.id}>
          <TopicSeries topicId={topic.id} />
          <TopicSection topic={topic} />
        </div>
      ))}
    </>
  );
}
export function DeskContinuation({ model }: DeskPartProps) {
  const t = useTranslations("editorial");
  if (model.rest.length <= 12) return null;
  return (
    <section className="border-t border-neutral-200 p-5">
      <h2 className="text-xl font-bold">{t("more")}</h2>
      <ArticleTimeline articles={model.rest.slice(12)} />
    </section>
  );
}

export function DeskEmptyNotice({ model }: DeskPartProps) {
  const t = useTranslations("categoriesPage");
  return !model.selection.isLoading && !model.lead ? (
    <div className="p-5">
      <EmptyState message={t("noArticles")} />
    </div>
  ) : null;
}
