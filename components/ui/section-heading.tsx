import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-bright">
          {eyebrow}
        </span>
        <span className="h-px flex-1 max-w-24 glow-line" />
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
      {description && (
        <p className="text-ink-dim max-w-2xl leading-relaxed text-[15px]">{description}</p>
      )}
    </div>
  );
}
