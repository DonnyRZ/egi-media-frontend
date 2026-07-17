import { useTranslations } from "next-intl";

import type { TermsSection } from "@/features/terms/types/terms.types";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";

export function TermsBody() {
  const t = useTranslations("terms");
  const sections = t.raw("sections") as TermsSection[];

  return (
    <Section ariaLabelledby="terms-body-heading">
      <Container>
        <h2 id="terms-body-heading" className="sr-only">
          {t("headline")}
        </h2>
        <ol className="mx-auto max-w-3xl space-y-12">
          {sections.map((section, index) => (
            <li key={section.title}>
              <h3 className="flex items-baseline gap-3 font-serif text-xl font-bold text-ink sm:text-2xl">
                <span aria-hidden="true" className="text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h3>
              <div className="mt-4 space-y-4 border-l border-neutral-200 pl-6 sm:pl-8">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-base leading-8 text-neutral-700"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
