import * as React from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  hover = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn("glass rounded-2xl", hover && "glass-hover", className)}
      {...props}
    />
  );
}
