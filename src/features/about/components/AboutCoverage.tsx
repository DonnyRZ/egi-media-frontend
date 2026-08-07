import { useTranslations } from "next-intl";

import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import type { CoverageTopic } from "@/features/about/types/about.types";

export function AboutCoverage() {
  const t = useTranslations("about");
  const topics = t.raw("coverage") as CoverageTopic[];

  return (
    <Section ariaLabelledby="about-coverage-heading">
      <Container>
        <SectionHeading
          id="about-coverage-heading"
          subtitle={t("coverageSubtitle")}
          title={t("coverageTitle")}
        />
        <ul className="grid gap-px overflow-hidden border border-neutral-300 bg-neutral-300 sm:grid-cols-2 lg:grid-cols-5">
          {topics.map((topic, index) => (
            <li key={topic.label} className="bg-white p-6">
              <span className="font-serif text-sm font-bold text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-serif text-xl font-bold text-ink">{topic.label}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">{topic.description}</p>
            </li>
          ))}
          {topics.length % 2 === 1 ? (
            <li aria-hidden="true" className="hidden bg-white sm:block lg:hidden" />
          ) : null}
        </ul>
      </Container>
    </Section>
  );
}
