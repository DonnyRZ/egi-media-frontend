"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function TopicsHero() {
  const t = useTranslations("editorial");

  return (
    <FrameModule ariaLabelledby="topics-hero-heading">
      <FramePageHero
        title={t("topics")}
        titleId="topics-hero-heading"
      />
    </FrameModule>
  );
}
