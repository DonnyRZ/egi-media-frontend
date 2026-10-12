"use client";

import { useFormatter, useTranslations } from "next-intl";

import { ColumnAuthor } from "@/features/columns/components/ColumnAuthor";
import { Link } from "@/i18n/navigation";
import type { ColumnListItem } from "@/features/columns/types/column.types";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { DATE_FORMAT } from "@/shared/constants/format.constants";

interface ColumnCardProps {
  column: ColumnListItem;
  variant?: "default" | "featured" | "row";
}

export function ColumnCard({ column, variant = "default" }: ColumnCardProps) {
  const t = useTranslations("columnsPage");
  const format = useFormatter();
  const href = `/kolom/${column.slug}`;
  const dateValue = column.publishedAt ?? column.createdAt;

  if (variant === "row") return <article className="grid gap-4 py-5 md:grid-cols-[1fr_160px]"><div><p className="kicker">{t("kicker")}</p><h3 className="mt-2 text-xl font-bold leading-tight"><Link href={href}>{column.title}</Link></h3>{column.summary?<p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">{column.summary}</p>:null}<ColumnAuthor author={column.author}/></div><Link href={href} className="relative aspect-video w-32 md:w-full"><ArticleImage src={column.featuredImage} alt={column.title}/></Link></article>;
  if (variant === "featured") {
    return (
      <article className="group grid gap-6 p-5 lg:grid-cols-[1.2fr_1fr] lg:gap-10 lg:p-6">
        <Link className="block" href={href}>
          <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
            <ArticleImage
              alt={column.title}
              sizes="(max-width: 768px) 100vw, 50vw"
              src={column.featuredImage}
            />
          </div>
        </Link>
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-3">
            <span className="kicker">{t("featuredKicker")}</span>
            <time
              className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
              dateTime={dateValue}
            >
              {format.dateTime(new Date(dateValue), DATE_FORMAT)}
            </time>
          </div>
          <h2 className="mt-3 font-sans text-3xl font-bold leading-tight text-ink transition-colors group-hover:text-accent sm:text-4xl">
            <Link href={href}>{column.title}</Link>
          </h2>
          {column.summary ? (
            <p className="mt-4 line-clamp-3 text-base leading-7 text-neutral-700">
              {column.summary}
            </p>
          ) : null}
          <ColumnAuthor author={column.author}/>
          <Link
            className="mt-4 inline-flex text-sm font-semibold text-primary-700 transition-colors hover:text-accent"
            href={href}
          >
            {t("readColumn")} →
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col bg-white p-5">
      <Link className="block" href={href}>
        <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
          <ArticleImage
            alt={column.title}
            sizes="(max-width: 768px) 100vw, 33vw"
            src={column.featuredImage}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="kicker">{t("kicker")}</span>
          <time
            className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
            dateTime={dateValue}
          >
            {format.dateTime(new Date(dateValue), DATE_FORMAT)}
          </time>
        </div>
        <h3 className="mt-2 font-sans text-xl font-bold leading-snug text-ink transition-colors group-hover:text-accent">
          <Link href={href}>{column.title}</Link>
        </h3>
        {column.summary ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-neutral-600">
            {column.summary}
          </p>
        ) : null}
        <ColumnAuthor author={column.author}/>
      </div>
    </article>
  );
}
