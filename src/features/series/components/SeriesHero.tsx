"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function SeriesHero() {
  const t = useTranslations("seriesPage");

  return (
    <FrameModule ariaLabelledby="series-hero-heading">
      <FramePageHero
        kicker={t("kicker")}
        lede={t("lede")}
        title={t("headline")}
        titleId="series-hero-heading"
      />
    </FrameModule>
  );
}
