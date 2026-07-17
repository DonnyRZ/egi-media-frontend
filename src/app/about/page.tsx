import type { Metadata } from "next";

import { AboutHero } from "@/features/about/components/AboutHero";
import { AboutStory } from "@/features/about/components/AboutStory";
import { AboutCoverage } from "@/features/about/components/AboutCoverage";
import { TeamSection } from "@/features/about/components/TeamSection";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "EGI Media menjembatani konten visual yang dinamis dengan literasi yang tajam melalui podcast, video, dan artikel seputar Politik, Teknologi, Sport, Hiburan, dan Wisata.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutCoverage />
      <TeamSection />
    </>
  );
}
