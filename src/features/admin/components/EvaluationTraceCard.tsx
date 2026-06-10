import { ChevronDown, ChevronUp, BarChart3, AlertTriangle, RefreshCw } from "lucide-react";
import { useState } from "react";

import { cn } from "../../../lib/utils/cn";
import { useRecalculateEvaluationMutation } from "../hooks/admin.hooks";
import type { EvaluationTraceResponse } from "../api/admin.api";

const tipoItemLabels: Record<string, string> = {
  FORMACION: "Formacion",
  EXPERIENCIA: "Experiencia",
  PRODUCCION: "Produccion",
  PONENCIA: "Ponencia",
  INVESTIGACION: "Investigacion",
  DOCUMENTO: "Documento",
  OTRO: "Otro",
};

type Props = {
  trace: EvaluationTraceResponse;
};

export function EvaluationTraceCard({ trace }: Props) {
  const [expanded, setExpanded] = useState(false);
  const recalc = useRecalculateEvaluationMutation();

  const handleRecalculate = () => {
    recalc.mutate(trace.id_postulacion);
  };

  // Group by tipo_item for summary
  const sectionSummary = trace.detalle_evaluacion.reduce(
    (acc, item) => {
      const tipo = item.tipo_item;
      if (!acc[tipo]) {
        acc[tipo] = { count: 0, total: 0, sin_regla: 0 };
      }
      acc[tipo].count += 1;
      acc[tipo].total += item.puntaje_asignado;
      if (item.sin_regla) acc[tipo].sin_regla += 1;
      return acc;
    },
    {} as Record<string, { count: number; total: number; sin_regla: number }>,
  );

  const hasWarnings = trace.advertencias.length > 0 || trace.detalle_evaluacion.some((i) => i.sin_regla);

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <button
          type="button"
          className="flex flex-1 items-center justify-between px-6 py-4 text-left transition hover:bg-gray-50"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-brand-700" />
            <div>
              <h3 className="text-sm font-semibold text-ink">Trazabilidad del puntaje</h3>
              <p className="text-xs text-gray-500">
                Puntaje total:{" "}
                <span className="font-bold text-brand-700">
                  {trace.puntaje_total.toFixed(2)}
                </span>{" "}
                &middot; {trace.detalle_evaluacion.length} items
                {hasWarnings && (
                  <span className="ml-2 text-amber-600">
                    &middot; {trace.advertencias.length} advertencias
                  </span>
                )}
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {/* Recalculate button */}
        <button
          type="button"
          className={cn(
            "m-2 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition",
            recalc.isPending
              ? "cursor-not-allowed bg-gray-200 text-gray-400"
              : "text-brand-700 hover:bg-brand-50",
          )}
          onClick={handleRecalculate}
          disabled={recalc.isPending}
          title="Recalcular evaluacion con reglas e items actuales"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", recalc.isPending && "animate-spin")} />
          {recalc.isPending ? "Recalculando..." : "Recalcular"}
        </button>
      </div>

      {/* Warnings */}
      {hasWarnings && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600 shrink-0" />
            <div className="space-y-1">
              {trace.advertencias.map((w, idx) => (
                <p key={idx} className="text-xs text-amber-800">{w}</p>
              ))}
              {trace.detalle_evaluacion
                .filter((i) => i.sin_regla)
                .map((i) => (
                  <p key={`sin-${i.id_item}`} className="text-xs text-amber-800">
                    Item #{i.id_item} ({tipoItemLabels[i.tipo_item] ?? i.tipo_item}): sin regla de evaluacion
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-200 px-6 py-4">
          {/* Section summary */}
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(sectionSummary).map(([tipo, { count, total, sin_regla }]) => (
              <div
                key={tipo}
                className={cn(
                  "rounded-md border px-3 py-2",
                  sin_regla > 0
                    ? "border-amber-200 bg-amber-50"
                    : "border-gray-100 bg-gray-50",
                )}
              >
                <p className="text-xs font-medium text-gray-500">
                  {tipoItemLabels[tipo] ?? tipo}
                </p>
                <p className="text-sm font-semibold text-ink">
                  {count} {count === 1 ? "item" : "items"} &middot;{" "}
                  <span className="text-brand-700">{total.toFixed(2)} pts</span>
                </p>
                {sin_regla > 0 && (
                  <p className="text-xs text-amber-700">
                    {sin_regla} sin regla
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Per-item detail */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Item
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tipo
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Cantidad
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    P. unitario
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Regla
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Max. acum.
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Asignado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trace.detalle_evaluacion.map((item) => (
                  <tr
                    key={item.id_item}
                    className={cn(
                      "hover:bg-gray-50",
                      item.sin_regla && "bg-amber-50/50",
                    )}
                  >
                    <td className="px-4 py-2 text-ink">
                      <div className="flex items-center gap-1">
                        {item.sin_regla && (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        <span className={item.sin_regla ? "text-gray-400 line-through" : ""}>
                          {item.descripcion}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {tipoItemLabels[item.tipo_item] ?? item.tipo_item}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-500">{item.cantidad}</td>
                    <td className="px-4 py-2 text-center text-gray-500">
                      {item.puntaje_unitario > 0 ? item.puntaje_unitario.toFixed(2) : "—"}
                    </td>
                    <td className="px-4 py-2 text-center max-w-[180px]">
                      {item.regla_aplicada ? (
                        <span className="text-xs text-gray-500" title={item.regla_aplicada.descripcion_regla}>
                          #{item.regla_aplicada.id_regla}
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600">Sin regla</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-500">
                      {item.maximo_acumulable != null
                        ? item.maximo_acumulable.toFixed(2)
                        : "—"}
                    </td>
                    <td className={cn(
                      "px-4 py-2 text-right font-semibold",
                      item.sin_regla ? "text-gray-400" : "text-brand-700",
                    )}>
                      {item.puntaje_asignado.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
