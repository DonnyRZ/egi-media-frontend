"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function ForYouHero() {
  const t = useTranslations("editorial");

  return (
    <FrameModule ariaLabelledby="for-you-hero-heading">
      <FramePageHero
        title={t("forYou")}
        titleId="for-you-hero-heading"
      />
    </FrameModule>
  );
}
