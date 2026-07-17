import { useTranslations } from "next-intl";

import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { TeamMemberCard } from "@/features/about/components/TeamMemberCard";
import { LEADERSHIP, TEAM_MEMBERS } from "@/features/about/constants/about.constants";

export function TeamSection() {
  const t = useTranslations("about");

  return (
    <Section ariaLabelledby="about-team-heading">
      <Container>
        <SectionHeading
          id="about-team-heading"
          subtitle={t("teamSubtitle")}
          title={t("teamTitle")}
        />

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {LEADERSHIP.map((member) => (
            <TeamMemberCard
              key={member.id}
              featured
              member={member}
              role={t(`roles.${member.id}`)}
            />
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              role={t(`roles.${member.id}`)}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
