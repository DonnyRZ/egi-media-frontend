"use client";
import { useTranslations } from "next-intl";
import { useSearchResults } from "@/features/search/hooks/useSearchResults";
import { ArticleTimeline } from "@/shared/components/common/ArticleTimeline";
import { ColumnCard } from "@/features/columns/components/ColumnCard";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
interface SearchSectionProps {
  query: string;
  kind: "articles" | "columns";
}
interface SearchModelProps {
  model: ReturnType<typeof useSearchResults>;
}
function SearchResultStatus({ model }: SearchModelProps) {
  return (
    <>
      {model.result.isLoading ? (
        <div
          className="my-5 h-24 animate-pulse bg-neutral-100"
          aria-busy="true"
        />
      ) : null}
      {model.result.isError ? (
        <ErrorState
          message={model.result.error.message}
          onRetry={() => void model.result.refetch()}
        />
      ) : null}
    </>
  );
}
function SearchResultItems({
  model,
  kind,
}: SearchModelProps & { kind: SearchSectionProps["kind"] }) {
  return (
    <>
      {kind === "articles" && model.articles.data ? (
        <ArticleTimeline articles={model.articles.data.items} />
      ) : null}
      {kind === "columns" && model.columns.data ? (
        <div className="divide-y divide-neutral-200">
          {model.columns.data.items.map((column) => (
            <ColumnCard key={column.id} column={column} variant="row" />
          ))}
        </div>
      ) : null}
    </>
  );
}
export function SearchResultSection({ query, kind }: SearchSectionProps) {
  const model = useSearchResults(query, kind);
  const t = useTranslations("searchPage");
  const result = model.result;
  return (
    <section className="border-t border-neutral-200 px-5 py-5">
      <h2 className="text-xl font-bold">
        {t(kind === "articles" ? "articlesHeading" : "columnsHeading")}
      </h2>
      <SearchResultStatus model={model} />
      {result.data ? (
        <p className="mt-2 text-sm text-neutral-600">
          {t("resultCount", { count: result.data.total })}
        </p>
      ) : null}
      <SearchResultItems model={model} kind={kind} />
      {result.data?.total === 0 ? (
        <p className="py-5 text-neutral-600">{t("emptyResults", { query })}</p>
      ) : null}
      {result.data ? (
        <Pagination
          currentPage={model.page}
          totalPages={result.data.totalPages}
          totalItems={result.data.total}
          pageSize={12}
          basePath="/search"
          pageParam={kind + "_page"}
        />
      ) : null}
    </section>
  );
}
