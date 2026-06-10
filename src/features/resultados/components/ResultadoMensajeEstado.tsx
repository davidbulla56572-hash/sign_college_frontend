import { AlertCircle, CheckCircle, Clock, FileText, Info } from "lucide-react";

import type { EstadoColor } from "../types/resultados.types";

const iconMap: Record<EstadoColor, React.ReactNode> = {
  gray: <FileText className="h-5 w-5" />,
  blue: <Clock className="h-5 w-5" />,
  amber: <AlertCircle className="h-5 w-5" />,
  green: <CheckCircle className="h-5 w-5" />,
  red: <Info className="h-5 w-5" />,
};

const bgMap: Record<EstadoColor, string> = {
  gray: "bg-gray-50 border-gray-200 text-gray-700",
  blue: "bg-blue-50 border-blue-200 text-blue-800",
  amber: "bg-amber-50 border-amber-200 text-amber-800",
  green: "bg-emerald-50 border-emerald-200 text-emerald-800",
  red: "bg-red-50 border-red-200 text-red-800",
};

export function ResultadoMensajeEstado({
  mensaje,
  color,
}: {
  mensaje: string;
  color: EstadoColor;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${bgMap[color] ?? bgMap.gray}`}
    >
      <span className="mt-0.5 shrink-0">{iconMap[color] ?? iconMap.gray}</span>
      <p className="leading-relaxed">{mensaje}</p>
    </div>
  );
}
