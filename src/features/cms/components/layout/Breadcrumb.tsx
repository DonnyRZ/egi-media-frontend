"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SEGMENT_LABELS: Record<string, string> = {
  cms: "Home",
  articles: "Articles",
  new: "New",
  categories: "Categories",
  topics: "Topics",
  tags: "Tags",
  series: "Series",
  media: "Media",
  users: "Users",
  settings: "Settings",
};

function labelFor(segment: string) {
  return SEGMENT_LABELS[segment] ?? "Edit";
}

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm md:flex">
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        return (
          <Fragment key={href}>
            {index > 0 ? (
              <span className="text-neutral-300 dark:text-neutral-600">/</span>
            ) : null}
            {isLast ? (
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {labelFor(segment)}
              </span>
            ) : (
              <Link
                href={href}
                className="text-neutral-500 transition-colors hover:text-accent dark:text-neutral-400"
              >
                {labelFor(segment)}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
