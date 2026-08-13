"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function TopicsHero() {
  const t = useTranslations("topicsPage");

  return (
    <FrameModule ariaLabelledby="topics-hero-heading">
      <FramePageHero
        kicker={t("kicker")}
        lede={t("lede")}
        title={t("headline")}
        titleId="topics-hero-heading"
      />
    </FrameModule>
  );
}
