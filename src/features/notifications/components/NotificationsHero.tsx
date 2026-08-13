"use client";

import { useTranslations } from "next-intl";

import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function NotificationsHero() {
  const t = useTranslations("notificationsPage");

  return (
    <FrameModule ariaLabelledby="notifications-hero-heading">
      <FramePageHero
        kicker={t("kicker")}
        lede={t("lede")}
        title={t("headline")}
        titleId="notifications-hero-heading"
      />
    </FrameModule>
  );
}
