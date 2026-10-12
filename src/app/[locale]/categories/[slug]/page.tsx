import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CategoryDetailView } from "@/features/categories/components/CategoryDetailView";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { HEADER_CATEGORY_I18N_KEYS } from "@/shared/constants/header-categories.constants";
import { getCategoryBySlug } from "@/shared/repositories/category.repository";
import { toContentLocale } from "@/shared/utils/locale";

interface CategoryDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = toContentLocale(locale);
  const hubKey = HEADER_CATEGORY_I18N_KEYS[slug];

  if (hubKey) {
    const tHubs = await getTranslations({ locale, namespace: "categoryHubs" });
    return {
      title: tHubs(`${hubKey}.metaTitle`),
      description: tHubs(`${hubKey}.metaDescription`),
    };
  }

  const category = await getCategoryBySlug(slug, lang);
  const t = await getTranslations({ locale, namespace: "metadata" });

  if (category) {
    return {
      title: category.name,
      description: category.description ?? t("categoriesDescription"),
    };
  }

  return {
    title: t("categoriesTitle"),
    description: t("categoriesDescription"),
  };
}

function DetailFallback() {
  return (
    <PageFrame>
      <FrameModule>
        <div className="space-y-3 bg-white px-4 py-5 md:p-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </FrameModule>
      <FrameModule>
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3 bg-white px-4 py-5 md:p-5">
              <Skeleton className="aspect-[16/9] w-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ))}
        </div>
      </FrameModule>
    </PageFrame>
  );
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<DetailFallback />}>
      <CategoryDetailView slug={slug} />
    </Suspense>
  );
}
