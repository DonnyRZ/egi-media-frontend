"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function CategoriesHero() {
  const t = useTranslations("categoriesPage");

  return (
    <FrameModule ariaLabelledby="categories-hero-heading">
      <FramePageHero
        kicker={t("kicker")}
        lede={t("lede")}
        title={t("headline")}
        titleId="categories-hero-heading"
      />
    </FrameModule>
  );
}
