import Link from "next/link";

import type { Article } from "@/shared/types/article.types";
import { formatPublishedDate } from "@/shared/utils/format";

interface HeroHeadlineListProps {
  articles: Article[];
}

export function HeroHeadlineList({ articles }: HeroHeadlineListProps) {
  return (
    <div className="flex h-full flex-col gap-5 rounded-xl border border-neutral-300 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Latest Headlines
      </h3>
      <ul className="flex flex-1 flex-col gap-5">
        {articles.map((article) => (
          <li key={article.id} className="border-b border-neutral-200 pb-5 last:border-b-0 last:pb-0">
            {article.category ? (
              <span className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                {article.category.name}
              </span>
            ) : null}
            <h4 className="mt-1 text-base font-semibold text-neutral-900 hover:text-primary-700">
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </h4>
            <p className="mt-2 text-xs text-neutral-500">
              {formatPublishedDate(article.publishedAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
