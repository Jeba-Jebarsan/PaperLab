import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-void font-semibold hover:bg-primary-bright shadow-[0_0_24px_-6px_rgba(59,130,246,0.6)]",
  secondary: "glass text-ink hover:border-line-strong",
  ghost: "text-ink-dim hover:text-ink hover:bg-white/5",
  outline: "border border-line text-ink hover:border-primary/50 hover:bg-primary/5",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-sm",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-primary/60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
