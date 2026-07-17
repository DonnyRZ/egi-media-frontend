import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { COVERAGE_TOPICS } from "@/features/about/constants/about.constants";

export function AboutCoverage() {
  return (
    <Section ariaLabelledby="about-coverage-heading" className="bg-neutral-50">
      <Container>
        <SectionHeading
          id="about-coverage-heading"
          subtitle="Cakupan bahasan yang luas dan relevan dengan gaya hidup masa kini."
          title="Yang Kami Ulas"
        />
        <ul className="grid gap-px overflow-hidden border border-neutral-300 bg-neutral-300 sm:grid-cols-2 lg:grid-cols-5">
          {COVERAGE_TOPICS.map((topic, index) => (
            <li key={topic.label} className="bg-white p-6">
              <span className="font-serif text-sm font-bold text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-serif text-xl font-bold text-ink">{topic.label}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">{topic.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
