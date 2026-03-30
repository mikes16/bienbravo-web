import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16 lg:mb-20",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-bb-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-4xl uppercase leading-[1.1] md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-5 max-w-2xl text-base text-bb-muted md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
