"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { Category } from "@/shared/types/category.types";

interface CategoryCardProps {
  category: Category;
  variant?: "default" | "featured";
}

export function CategoryCard({
  category,
  variant = "default",
}: CategoryCardProps) {
  const t = useTranslations("categoriesPage");

  if (variant === "featured") {
    return (
      <article className="group border-b-2 border-ink pb-8 lg:pb-10">
        <p className="kicker">{t("featuredKicker")}</p>
        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-ink transition-colors group-hover:text-accent sm:text-4xl">
          <Link href={`/categories/${category.slug}`}>{category.name}</Link>
        </h2>
        {category.description ? (
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
            {category.description}
          </p>
        ) : null}
        <Link
          className="mt-5 inline-flex text-sm font-semibold text-primary-700 transition-colors hover:text-accent"
          href={`/categories/${category.slug}`}
        >
          {t("browseCategory")} →
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col border-t-2 border-ink pt-4">
      <p className="kicker">{t("kicker")}</p>
      <h3 className="mt-2 font-serif text-xl font-bold leading-snug text-ink transition-colors group-hover:text-accent">
        <Link href={`/categories/${category.slug}`}>{category.name}</Link>
      </h3>
      {category.description ? (
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-neutral-600">
          {category.description}
        </p>
      ) : null}
      <Link
        className="mt-4 inline-flex text-sm font-semibold text-primary-700 transition-colors hover:text-accent"
        href={`/categories/${category.slug}`}
      >
        {t("browseCategory")} →
      </Link>
    </article>
  );
}
