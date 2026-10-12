"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function SeriesHero() {
  const t = useTranslations("editorial");

  return (
    <FrameModule ariaLabelledby="series-hero-heading">
      <FramePageHero
        title={t("series")}
        titleId="series-hero-heading"
      />
    </FrameModule>
  );
}
