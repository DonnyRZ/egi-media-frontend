"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function SavedArticlesHero() {
  const t = useTranslations("savedArticlesPage");

  return (
    <FrameModule ariaLabelledby="saved-articles-hero-heading">
      <FramePageHero
        kicker={t("kicker")}
        lede={t("lede")}
        title={t("headline")}
        titleId="saved-articles-hero-heading"
      />
    </FrameModule>
  );
}
