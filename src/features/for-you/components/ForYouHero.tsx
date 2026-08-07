"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function ForYouHero() {
  const t = useTranslations("forYouPage");

  return (
    <FrameModule ariaLabelledby="for-you-hero-heading">
      <FramePageHero
        kicker={t("kicker")}
        lede={t("lede")}
        title={t("headline")}
        titleId="for-you-hero-heading"
      />
    </FrameModule>
  );
}
