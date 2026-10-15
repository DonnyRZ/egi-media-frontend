"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function VideosHero() {
  const t = useTranslations("videosPage");

  return (
    <FrameModule ariaLabelledby="videos-hero-heading">
      <FramePageHero
        kicker={t("kicker")}
        title={t("headline")}
        titleId="videos-hero-heading"
      />
    </FrameModule>
  );
}
