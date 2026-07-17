import { Container } from "@/shared/components/layout/Container";
import {
  ABOUT_HEADLINE,
  ABOUT_KICKER,
  ABOUT_LEDE,
} from "@/features/about/constants/about.constants";

export function AboutHero() {
  return (
    <section aria-labelledby="about-hero-heading" className="border-b-2 border-ink">
      <Container className="py-12 lg:py-20">
        <p className="kicker">{ABOUT_KICKER}</p>
        <h1
          id="about-hero-heading"
          className="mt-4 max-w-4xl font-serif text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl"
        >
          {ABOUT_HEADLINE}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-700 lg:text-lg">
          {ABOUT_LEDE}
        </p>
      </Container>
    </section>
  );
}
