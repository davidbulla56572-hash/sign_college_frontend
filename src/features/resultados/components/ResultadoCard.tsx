import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { PostulacionEstadoBadge } from "./PostulacionEstadoBadge";
import { ResultadoHeaderCard } from "./ResultadoHeaderCard";
import { ResultadoPuntajeCard } from "./ResultadoPuntajeCard";
import { ResultadoResumenSection } from "./ResultadoResumenSection";
import { ResultadoMensajeEstado } from "./ResultadoMensajeEstado";
import type { MiResultado } from "../types/resultados.types";

function DetalleTable({
  detalle,
}: {
  detalle: MiResultado["detalle"];
}) {
  const tipoLabels: Record<string, string> = {
    FORMACION: "Formacion academica",
    EXPERIENCIA: "Experiencia profesional",
    PRODUCCION: "Produccion academica",
    PONENCIA: "Ponencias y conferencias",
    INVESTIGACION: "Investigacion",
    DOCUMENTO: "Documentos",
    OTRO: "Otros",
  };

  const grupos: Record<string, typeof detalle> = {};
  for (const item of detalle) {
    grupos[item.tipo_item] ??= [];
    grupos[item.tipo_item].push(item);
  }

  return (
    <div className="mt-4 space-y-2">
      {Object.entries(grupos).map(([tipo, items]) => (
        <GrupoDetalle
          key={tipo}
          tipo={tipoLabels[tipo] ?? tipo}
          items={items}
        />
      ))}
    </div>
  );
}

function GrupoDetalle({
  tipo,
  items,
}: {
  tipo: string;
  items: MiResultado["detalle"];
}) {
  const [expanded, setExpanded] = useState(false);
  const total = items.reduce((s, i) => s + i.puntaje_asignado, 0);

  return (
    <div className="rounded-lg border border-gray-200">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-ink">{tipo}</span>
          <span className="text-xs text-gray-400">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-brand-700">
            {total.toFixed(2)} pts
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500">
                <th className="pb-2 text-left font-medium">Descripcion</th>
                <th className="pb-2 text-right font-medium">Puntaje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id_item}>
                  <td className="py-2 text-gray-700">{item.descripcion}</td>
                  <td className="py-2 text-right font-medium text-ink">
                    {item.puntaje_asignado.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function ResultadoCard({ resultado }: { resultado: MiResultado }) {
  const [showDetalle, setShowDetalle] = useState(false);
  const hasEvaluation = resultado.puntaje_total != null;

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-soft">
      {/* Header + Puntaje */}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <ResultadoHeaderCard
          titulo={resultado.convocatoria.titulo}
          estado={resultado.estado_label}
          estadoColor={resultado.estado_color}
          fechaEvaluacion={resultado.fecha_evaluacion}
        />
        {hasEvaluation && (
          <ResultadoPuntajeCard puntaje={resultado.puntaje_total} />
        )}
      </div>

      {/* Mensaje contextual */}
      <ResultadoMensajeEstado
        mensaje={resultado.mensaje_contextual}
        color={resultado.estado_color}
      />

      {/* Resumen por categoria (solo si hay evaluacion) */}
      {hasEvaluation && resultado.resumen_evaluacion.length > 0 && (
        <ResultadoResumenSection resumen={resultado.resumen_evaluacion} />
      )}

      {/* Detalle expandible */}
      {resultado.detalle.length > 0 && (
        <button
          type="button"
          className="text-sm font-medium text-brand-700 transition hover:text-brand-600"
          onClick={() => setShowDetalle(!showDetalle)}
        >
          {showDetalle ? "Ocultar detalle" : "Ver detalle de evaluacion"}
        </button>
      )}
      {showDetalle && <DetalleTable detalle={resultado.detalle} />}
    </div>
  );
}
