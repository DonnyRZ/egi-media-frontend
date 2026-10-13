import { useTranslations } from "next-intl";

import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";

export function AboutStory() {
  const t = useTranslations("about");
  const paragraphs = t.raw("paragraphs") as string[];
  const [firstParagraph, ...restParagraphs] = paragraphs;

  return (
    <Section ariaLabelledby="about-story-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2
              id="about-story-heading"
              className="editorial-section-title text-lg font-bold uppercase tracking-wide text-ink sm:text-xl"
            >
              {t("storyTitle")}
            </h2>
            <blockquote className="mt-6 border-l-2 border-accent pl-5 font-serif text-xl italic leading-relaxed text-ink lg:text-2xl">
              “{t("pullQuote")}”
            </blockquote>
          </div>

          <div className="article-legacy editorial-reader space-y-6 lg:col-span-8">
            <p className="font-serif text-lg leading-8 text-ink first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-accent">
              {firstParagraph}
            </p>
            {restParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-base leading-8 text-neutral-700">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
