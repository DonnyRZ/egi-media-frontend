"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function TopicSubscriptionsHero() {
  const t = useTranslations("topicSubscriptionsPage");

  return (
    <FrameModule ariaLabelledby="topic-subscriptions-hero-heading">
      <FramePageHero
        kicker={t("kicker")}
        title={t("headline")}
        titleId="topic-subscriptions-hero-heading"
      />
    </FrameModule>
  );
}
