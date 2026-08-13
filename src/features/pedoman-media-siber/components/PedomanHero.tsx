import { useTranslations } from "next-intl";

import { Container } from "@/shared/components/layout/Container";

export function PedomanHero() {
  const t = useTranslations("pedomanSiber");

  return (
    <section aria-labelledby="pedoman-hero-heading">
      <Container>
        <div className="border-b border-neutral-200 py-12 lg:py-20">
          <p className="kicker">{t("kicker")}</p>
          <h1
            id="pedoman-hero-heading"
            className="mt-4 max-w-3xl font-serif text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            {t("headline")}
          </h1>
          <p className="mt-4 text-sm text-neutral-500">{t("adoptedOn")}</p>
          <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-700 lg:text-lg">
            {t("lede")}
          </p>
        </div>
      </Container>
    </section>
  );
}
