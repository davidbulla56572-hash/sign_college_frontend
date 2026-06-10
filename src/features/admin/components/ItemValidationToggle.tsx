import { CheckCircle2, Circle } from "lucide-react";

import { cn } from "../../../lib/utils/cn";

type Props = {
  validado: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export function ItemValidationToggle({ validado, onToggle, disabled }: Props) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition",
        validado
          ? "bg-green-50 text-green-700 hover:bg-green-100"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200",
        disabled && "cursor-not-allowed opacity-50",
      )}
      onClick={onToggle}
      disabled={disabled}
      title={validado ? "Marcado como validado" : "Marcar como validado"}
    >
      {validado ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <Circle className="h-3.5 w-3.5" />
      )}
      {validado ? "Validado" : "Pendiente"}
    </button>
  );
}
