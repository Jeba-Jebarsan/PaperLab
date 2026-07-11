"use client";

/**
 * Ambient hero backdrop: floating aurora blobs + faint grid.
 * Pure CSS animation — zero JS per frame, cheap on battery.
 */
export function AnimatedBackground() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px] animate-float" />
      <div
        className="absolute top-24 -left-40 h-[380px] w-[380px] rounded-full bg-accent/12 blur-[120px] animate-float"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="absolute top-40 -right-32 h-[340px] w-[420px] rounded-full bg-rose/10 blur-[130px] animate-float"
        style={{ animationDelay: "-9s" }}
      />
      {/* fade to page background */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void" />
    </div>
  );
}
