import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { TeamMemberCard } from "@/features/about/components/TeamMemberCard";
import { LEADERSHIP, TEAM_MEMBERS } from "@/features/about/constants/about.constants";

export function TeamSection() {
  return (
    <Section ariaLabelledby="about-team-heading">
      <Container>
        <SectionHeading
          id="about-team-heading"
          subtitle="Orang-orang di balik setiap gagasan yang tersiar dan kata yang tertulis."
          title="Tim EGI Media"
        />

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {LEADERSHIP.map((member) => (
            <TeamMemberCard key={member.name} featured member={member} />
          ))}
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 grid-cols-2 lg:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
