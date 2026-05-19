import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import { Card } from "./Card";

type ErrorStateProps = {
  title?: string;
  description: string;
  action?: ReactNode;
};

export function ErrorState({
  action,
  description,
  title = "No se pudo cargar la informacion"
}: ErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50 text-red-900">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
        <div>
          <h3 className="text-base font-semibold text-red-800">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-red-700">{description}</p>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </Card>
  );
}
