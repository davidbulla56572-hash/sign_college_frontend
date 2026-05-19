import type { HTMLAttributes } from "react";

import { cn } from "../../lib/utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-brand border-[1.5px] border-border bg-white p-5 shadow-soft", className)}
      {...props}
    />
  );
}
