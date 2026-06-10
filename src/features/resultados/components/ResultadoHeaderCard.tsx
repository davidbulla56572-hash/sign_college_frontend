import { PostulacionEstadoBadge } from "./PostulacionEstadoBadge";
import type { EstadoColor } from "../types/resultados.types";

export function ResultadoHeaderCard({
  titulo,
  estado,
  estadoColor,
  fechaEvaluacion,
}: {
  titulo: string;
  estado: string;
  estadoColor: EstadoColor;
  fechaEvaluacion?: string | null;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-ink">{titulo}</h3>
        <div className="flex items-center gap-3">
          <PostulacionEstadoBadge estado={estado} color={estadoColor} />
          {fechaEvaluacion && (
            <span className="text-xs text-gray-400">
              Evaluado el{" "}
              {new Date(fechaEvaluacion).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
