import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { cn } from "@/shared/lib/cn";
import type { TeamMember } from "@/features/about/types/about.types";

interface TeamMemberCardProps {
  member: TeamMember;
  role: string;
  featured?: boolean;
}

export function TeamMemberCard({ member, role, featured = false }: TeamMemberCardProps) {
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <ArticleImage
          alt={member.name}
          className="grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
          src={member.image}
        />
      </div>
      <h3
        className={cn(
          "mt-4 font-serif font-bold text-ink",
          featured ? "text-xl lg:text-2xl" : "text-lg",
        )}
      >
        {member.name}
      </h3>
      <p className="mt-1 text-sm leading-6 text-neutral-500">{role}</p>
    </article>
  );
}
