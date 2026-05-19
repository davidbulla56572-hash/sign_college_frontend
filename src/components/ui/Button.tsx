import type { ButtonHTMLAttributes } from "react";

import { cn } from "../../lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline-white";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-white border-2 border-brand-primary hover:bg-brand-primaryDark focus-visible:ring-brand-primary",
  secondary:
    "border-2 border-border bg-cream text-ink-mid hover:bg-brand-veryPale focus-visible:ring-brand-primary",
  ghost: "text-ink-mid hover:bg-brand-veryPale focus-visible:ring-brand-primary",
  "outline-white":
    "bg-transparent text-white border-2 border-white hover:bg-white/15 focus-visible:ring-white/50",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-brand-sm px-10 py-4 font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
