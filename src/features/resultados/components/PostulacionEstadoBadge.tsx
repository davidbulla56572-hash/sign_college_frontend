import { cn } from "../../../lib/utils/cn";
import type { EstadoColor } from "../types/resultados.types";

const colorMap: Record<EstadoColor, string> = {
  gray: "bg-gray-100 text-gray-700",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
};

export function PostulacionEstadoBadge({
  estado,
  color,
}: {
  estado: string;
  color: EstadoColor;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase",
        colorMap[color] ?? colorMap.gray,
      )}
    >
      {estado}
    </span>
  );
}
