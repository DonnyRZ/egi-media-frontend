"use client";

import { Icons } from "@/features/cms/components/ui/Icons";
import { Select } from "@/features/cms/components/ui/Select";
import { ARTICLE_STATUS_META } from "@/features/cms/constants/cms.constants";
import { BASE_FIELD } from "@/features/cms/components/ui/Input";
import { cn } from "@/shared/lib/cn";
import type { ArticleStatus } from "@/features/cms/types/cms.types";

export type ArticleSortKey = "newest" | "oldest" | "title";

interface ArticleFiltersProps {
  search: string;
  status: ArticleStatus | "";
  sort: ArticleSortKey;
  onSearch: (value: string) => void;
  onStatus: (value: ArticleStatus | "") => void;
  onSort: (value: ArticleSortKey) => void;
}

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  ...Object.entries(ARTICLE_STATUS_META).map(([value, meta]) => ({
    value,
    label: meta.label,
  })),
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" },
];

export function ArticleFilters({
  search,
  status,
  sort,
  onSearch,
  onStatus,
  onSort,
}: ArticleFiltersProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Icons.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          className={cn(BASE_FIELD, "pl-9")}
          placeholder="Search your articles…"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
      <Select
        className="sm:w-44"
        options={STATUS_OPTIONS}
        value={status}
        onChange={(event) => onStatus(event.target.value as ArticleStatus | "")}
      />
      <Select
        className="sm:w-44"
        options={SORT_OPTIONS}
        value={sort}
        onChange={(event) => onSort(event.target.value as ArticleSortKey)}
      />
    </div>
  );
}
