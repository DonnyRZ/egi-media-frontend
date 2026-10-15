import { useTranslations } from "next-intl";

import { Container } from "@/shared/components/layout/Container";

export function AboutHero() {
  const t = useTranslations("about");

  return (
    <section aria-labelledby="about-hero-heading">
      <Container>
        <div className="border-b border-neutral-200 py-12 lg:py-20">
        <p className="kicker">{t("kicker")}</p>
        <h1
          id="about-hero-heading"
          className="editorial-page-title mt-4 max-w-4xl font-serif text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl"
        >
          {t("headline")}
        </h1>
        </div>
      </Container>
    </section>
  );
}
