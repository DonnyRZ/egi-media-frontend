"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function SavedArticlesHero() {
  const t = useTranslations("editorial");

  return (
    <FrameModule ariaLabelledby="saved-articles-hero-heading">
      <FramePageHero
        title={t("saved")}
        titleId="saved-articles-hero-heading"
      />
    </FrameModule>
  );
}
