"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { ContentMetadata } from "@/shared/components/common/ContentMetadata";
import { HorizontalMediaRow } from "@/shared/components/common/HorizontalMediaRow";
import { cn } from "@/shared/lib/cn";
import type { ColumnListItem } from "@/features/columns/types/column.types";

export function HorizontalColumnCard({ column, className }: { column: ColumnListItem; className?: string }) {
  const t = useTranslations("columnsPage");
  const href = `/kolom/${column.slug}`;
  return <article className={cn("editorial-card min-w-0 py-3", className)}>
    <HorizontalMediaRow side="right"
      media={<Link href={href} aria-label={column.title} className="absolute inset-0">
        <ArticleImage src={column.featuredImage} alt={column.featuredImageAlt || column.title}
          sizes="(max-width: 1023px) 42vw, 152px" />
      </Link>}
      kicker={t("kicker")}
      title={<h3 className="media-row-heading"><Link className="headline-link" href={href}>{column.title}</Link></h3>}
      description={column.summary}
      metadata={<ContentMetadata author={column.author.fullName} authorHref={`/kolom?author_id=${column.author.id}`}
        publishedAt={column.publishedAt ?? column.createdAt} readingTimeMinutes={column.readingTimeMinutes} compact />}
    />
  </article>;
}
