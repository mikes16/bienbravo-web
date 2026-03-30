import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] border border-bb-border bg-bb-surface-2 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-bb-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
