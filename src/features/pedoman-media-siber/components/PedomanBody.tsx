import { useTranslations } from "next-intl";

import type {
  PedomanClosing,
  PedomanSection,
} from "@/features/pedoman-media-siber/types/pedoman.types";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";

export function PedomanBody() {
  const t = useTranslations("pedomanSiber");
  const intro = t.raw("intro") as string[];
  const sections = t.raw("sections") as PedomanSection[];
  const closing = t.raw("closing") as PedomanClosing;

  return (
    <Section ariaLabelledby="pedoman-body-heading">
      <Container>
        <h2 id="pedoman-body-heading" className="sr-only">
          {t("bodyHeading")}
        </h2>

        <article className="editorial-reader prose prose-lg mx-auto max-w-3xl prose-headings:font-serif prose-headings:text-ink prose-p:text-neutral-700 prose-li:text-neutral-700 prose-strong:text-ink">
          {intro.map((paragraph) => (
            <p key={paragraph.slice(0, 64)}>{paragraph}</p>
          ))}

          {sections.map((section, index) => (
            <section key={section.title}>
              <h3 className="editorial-card-title">
                {index + 1}. {section.title}
              </h3>

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph.slice(0, 64)}>{paragraph}</p>
              ))}

              {section.items && section.items.length > 0 ? (
                <ol type="a">
                  {section.items.map((item) => (
                    <li key={item.text.slice(0, 64)}>
                      {item.text}
                      {item.children && item.children.length > 0 ? (
                        <ol>
                          {item.children.map((child) => (
                            <li key={child.slice(0, 64)}>{child}</li>
                          ))}
                        </ol>
                      ) : null}
                    </li>
                  ))}
                </ol>
              ) : null}
            </section>
          ))}

          <p className="not-prose mt-12 border-t border-neutral-200 pt-8 text-sm leading-7 text-neutral-500">
            <strong className="font-medium text-neutral-700">{closing.date}</strong>
            <br />
            {closing.agreedBy}
            <br />
            {closing.acknowledgedBy}
          </p>
        </article>
      </Container>
    </Section>
  );
}
