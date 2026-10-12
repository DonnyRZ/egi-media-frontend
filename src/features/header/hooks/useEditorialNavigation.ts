"use client";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useArticleLocaleStore } from "@/shared/stores/article-locale.store";
import { fetchCategories } from "@/shared/services/category.service";
import type { ContentLocale } from "@/shared/types/article.types";
export function useEditorialNavigation() {
  const path = usePathname();
  const lang = useLocale() as ContentLocale;
  const categoryId = useArticleLocaleStore((s) => s.categoryId);
  const categories = useQuery({
    queryKey: ["navigation-categories", lang],
    queryFn: () => fetchCategories({ lang, limit: 100 }),
    enabled: Boolean(categoryId) || path.startsWith("/categories/"),
    staleTime: 60000,
  });
  const category = categories.data?.items.find(
    (c) =>
      c.id ===
      (path.startsWith("/categories/") ? path.split("/")[2] : categoryId),
  );
  const activePath = category
    ? `/categories/${category.slug}`
    : path === "/shorts"
      ? "/videos"
      : path;
  return (href: string) =>
    href === "/"
      ? activePath === "/"
      : activePath === href || activePath.startsWith(href + "/");
}
