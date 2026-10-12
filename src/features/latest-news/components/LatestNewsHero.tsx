"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function LatestNewsHero() {
  const t = useTranslations("editorial");

  return (
    <FrameModule ariaLabelledby="latest-news-hero-heading">
      <FramePageHero
        title={t("headline")}
        titleId="latest-news-hero-heading"
      />
    </FrameModule>
  );
}
