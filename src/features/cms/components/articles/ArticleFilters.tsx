"use client";

import { Icons } from "@/features/cms/components/ui/Icons";
import { Select } from "@/features/cms/components/ui/Select";
import { BASE_FIELD } from "@/features/cms/components/ui/Input";
import { cn } from "@/shared/lib/cn";

export type ArticleSortKey = "newest" | "oldest" | "title" | "views";

interface ArticleFiltersProps {
  search: string;
  sort: ArticleSortKey;
  onSearch: (value: string) => void;
  onSort: (value: ArticleSortKey) => void;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" },
  { value: "views", label: "Most viewed" },
];

export function ArticleFilters({
  search,
  sort,
  onSearch,
  onSort,
}: ArticleFiltersProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Icons.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          className={cn(BASE_FIELD, "pl-9")}
          placeholder="Search articles…"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
      <Select
        className="sm:w-44"
        options={SORT_OPTIONS}
        value={sort}
        onChange={(event) => onSort(event.target.value as ArticleSortKey)}
      />
    </div>
  );
}
