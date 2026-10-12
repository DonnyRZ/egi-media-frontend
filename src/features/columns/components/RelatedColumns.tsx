"use client";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { fetchColumns } from "@/features/columns/services/column.service";
import { ColumnCard } from "@/features/columns/components/ColumnCard";
import { ErrorState } from "@/shared/components/common/ErrorState";
import type { ContentLocale } from "@/shared/types/article.types";
export function RelatedColumns({
  id,
  authorId,
}: {
  id: string;
  authorId: string;
}) {
  const lang = useLocale() as ContentLocale;
  const t = useTranslations("editorial");
  const query = useQuery({
    queryKey: ["related-columns", authorId, lang],
    queryFn: () => fetchColumns({ author_id: authorId, lang, limit: 5 }),
  });
  const items = query.data?.items.filter((c) => c.id !== id).slice(0, 4) || [];
  if (query.isError)
    return (
      <div className="px-4 py-5 md:p-5">
        <ErrorState onRetry={() => void query.refetch()} />
      </div>
    );
  if (!items.length) return null;
  return (
    <section className="border-t border-neutral-200 px-4 py-5 md:p-5 lg:p-8">
      <h2 className="mb-5 text-xl font-bold">{t("moreColumns")}</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((column) => (
          <ColumnCard key={column.id} column={column} className="max-md:px-0" />
        ))}
      </div>
    </section>
  );
}
