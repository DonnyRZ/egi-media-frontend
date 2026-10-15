import { getTranslations } from "next-intl/server";

import { TeamMemberCard } from "@/features/about/components/TeamMemberCard";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { getActiveTeamMembers } from "@/shared/repositories/team-members.repository";

const FEATURED_COUNT = 2;

export async function TeamSection() {
  const t = await getTranslations("about");
  let members: Awaited<ReturnType<typeof getActiveTeamMembers>> = [];

  try {
    members = await getActiveTeamMembers();
  } catch {
    members = [];
  }

  const leadership = members.slice(0, FEATURED_COUNT);
  const rest = members.slice(FEATURED_COUNT);

  return (
    <Section ariaLabelledby="about-team-heading">
      <Container>
        <SectionHeading
          id="about-team-heading"
          title={t("teamTitle")}
        />

        {members.length === 0 ? (
          <p className="mt-6 text-sm text-neutral-500">
            Team roster will appear here once published.
          </p>
        ) : null}

        {leadership.length > 0 ? (
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {leadership.map((member) => (
              <TeamMemberCard
                key={member.id}
                featured
                member={member}
                role={member.role}
              />
            ))}
          </div>
        ) : null}

        {rest.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-3">
            {rest.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                role={member.role}
              />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
