import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { ProfesionalCtaBand } from "@/features/profesional/components/ProfesionalCtaBand";
import {
  ProfesionalCopyList,
  ProfesionalPageBanner,
  ProfesionalRichCopy,
} from "@/features/profesional/components/ProfesionalPageBanner";
import { PAGE_BANNERS, PROFESIONAL_LOCALE } from "@/features/profesional/constants/profesional.constants";
import { profesionalPageMeta } from "@/features/profesional/lib/profesional-metadata";

const LEADERSHIP_POINTS = [
  "attentionPointOne",
  "attentionPointTwo",
  "attentionPointThree",
  "urgencyMorning",
  "urgencyAlert",
  "urgencyMeeting",
] as const;

interface LeadershipPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: LeadershipPageProps): Promise<Metadata> {
  const { locale } = await params;
  return profesionalPageMeta(locale, "leadershipTitle", "leadershipLede");
}

export default async function LeadershipPage({ params }: LeadershipPageProps) {
  await params;
  setRequestLocale(PROFESIONAL_LOCALE);

  return (
    <>
      <ProfesionalPageBanner
        image={PAGE_BANNERS.leadership}
        kickerKey="navLeadership"
        ledeKey="leadershipLede"
        titleKey="leadershipTitle"
      />
      <ProfesionalRichCopy>
        <ProfesionalCopyList keys={LEADERSHIP_POINTS} />
      </ProfesionalRichCopy>
      <ProfesionalCtaBand />
    </>
  );
}
