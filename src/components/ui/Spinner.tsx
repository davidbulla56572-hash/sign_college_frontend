import { LoaderCircle } from "lucide-react";

import { cn } from "../../lib/utils/cn";

type SpinnerProps = {
  className?: string;
  label?: string;
};

export function Spinner({ className, label = "Cargando" }: SpinnerProps) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-ink-mid" role="status">
      <LoaderCircle className={cn("h-4 w-4 animate-spin text-brand-primary", className)} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
