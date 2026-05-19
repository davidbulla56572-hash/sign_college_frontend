import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

import { Card } from "./Card";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <Card className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-brand bg-brand-veryPale text-brand-primary">
        <Inbox className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-mid">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}
