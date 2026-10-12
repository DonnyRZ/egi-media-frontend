"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function CategoriesHero() {
  const t = useTranslations("editorial");

  return (
    <FrameModule ariaLabelledby="categories-hero-heading">
      <FramePageHero
        title={t("categories")}
        titleId="categories-hero-heading"
      />
    </FrameModule>
  );
}
