import { cn } from "@/shared/lib/cn";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  id: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-8 lg:mb-10", className)}>
      <h2
        id={id}
        className="text-2xl font-bold text-neutral-900 sm:text-3xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-base text-neutral-500">{subtitle}</p>
      ) : null}
    </div>
  );
}
