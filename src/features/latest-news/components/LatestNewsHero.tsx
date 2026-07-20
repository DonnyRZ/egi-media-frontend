"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/shared/components/layout/Container";

export function LatestNewsHero() {
  const t = useTranslations("latestNewsPage");

  return (
    <section aria-labelledby="latest-news-hero-heading" className="border-b border-neutral-200">
      <Container className="py-8 lg:py-10">
        <p className="kicker">{t("kicker")}</p>
        <h1
          id="latest-news-hero-heading"
          className="mt-2 max-w-3xl font-serif text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl"
        >
          {t("headline")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 lg:text-base lg:leading-7">
          {t("lede")}
        </p>
      </Container>
    </section>
  );
}
