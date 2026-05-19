import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "../../../lib/utils/cn";
import type { DetalleItemResultado } from "../api/resultados.api";

const tipoLabels: Record<string, string> = {
  FORMACION: "Formacion academica",
  EXPERIENCIA: "Experiencia profesional",
  PRODUCCION: "Produccion academica",
  PONENCIA: "Ponencias",
  INVESTIGACION: "Investigacion",
  DOCUMENTO: "Documentos",
  OTRO: "Otros",
};

function GrupoTipo({
  tipo,
  items,
}: {
  tipo: string;
  items: DetalleItemResultado[];
}) {
  const [expanded, setExpanded] = useState(false);
  const totalPuntaje = items.reduce(
    (sum, i) => sum + i.puntaje_asignado,
    0,
  );

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-ink">
            {tipoLabels[tipo] ?? tipo}
          </span>
          <span className="text-xs text-gray-400">{items.length} items</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-brand-700">
            {totalPuntaje.toFixed(2)} pts
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>
      {expanded && (
        <div className="bg-gray-50 px-4 py-2">
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

export function ResultadoDetalle({
  detalle,
}: {
  detalle: DetalleItemResultado[];
}) {
  if (detalle.length === 0) return null;

  // Group by tipo_item
  const grupos: Record<string, DetalleItemResultado[]> = {};
  for (const item of detalle) {
    grupos[item.tipo_item] ??= [];
    grupos[item.tipo_item].push(item);
  }

  return (
    <div className="mt-4 rounded-md border border-gray-200">
      <div className="px-4 py-2 bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
        Detalle de evaluacion
      </div>
      {Object.entries(grupos).map(([tipo, items]) => (
        <GrupoTipo key={tipo} tipo={tipo} items={items} />
      ))}
    </div>
  );
}

const estadoLabels: Record<string, string> = {
  BORRADOR: "Borrador",
  ENVIADA: "Enviada",
  EN_EVALUACION: "En evaluacion",
  EVALUADA: "Evaluada",
  RECHAZADA: "Rechazada",
};

const estadoColors: Record<string, string> = {
  BORRADOR: "bg-gray-100 text-gray-600",
  ENVIADA: "bg-blue-50 text-blue-700",
  EN_EVALUACION: "bg-amber-50 text-amber-700",
  EVALUADA: "bg-green-50 text-green-700",
  RECHAZADA: "bg-red-50 text-red-700",
};

export function ResultadoEstadoBadge({ estado }: { estado: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        estadoColors[estado] ?? "bg-gray-100 text-gray-600",
      )}
    >
      {estadoLabels[estado] ?? estado}
    </span>
  );
}

export function ResultadoCard({
  resultado,
}: {
  resultado: {
    id_postulacion: number;
    estado: string;
    puntaje_total: number | null;
    fecha_evaluacion: string | null;
    convocatoria: { titulo: string };
    detalle: DetalleItemResultado[];
  };
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-ink">
            {resultado.convocatoria.titulo}
          </h3>
          <div className="mt-1 flex items-center gap-3">
            <ResultadoEstadoBadge estado={resultado.estado} />
            {resultado.fecha_evaluacion && (
              <span className="text-xs text-gray-400">
                Evaluado el{" "}
                {new Date(resultado.fecha_evaluacion).toLocaleDateString(
                  "es-CO",
                )}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Puntaje total</p>
          <p className="text-2xl font-bold text-brand-700">
            {resultado.puntaje_total != null
              ? resultado.puntaje_total.toFixed(2)
              : "—"}
          </p>
        </div>
      </div>

      {resultado.detalle.length > 0 && (
        <>
          <button
            type="button"
            className="mt-3 text-sm font-medium text-brand-700 hover:text-brand-600"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Ocultar detalle" : "Ver detalle de evaluacion"}
          </button>
          {expanded && <ResultadoDetalle detalle={resultado.detalle} />}
        </>
      )}
    </div>
  );
}
