import type { ResumenEvaluacion } from "../types/resultados.types";

export function ResultadoResumenSection({
  resumen,
}: {
  resumen: ResumenEvaluacion[];
}) {
  if (resumen.length === 0) return null;

  const maxPuntaje = Math.max(...resumen.map((r) => r.puntaje_obtenido), 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Resumen por categoria
      </h4>
      <div className="space-y-3">
        {resumen.map((r) => (
          <div key={r.tipo_item} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-ink">{r.label}</span>
              <span className="font-semibold text-brand-700">
                {r.puntaje_obtenido.toFixed(2)} pts
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
                style={{
                  width: `${(r.puntaje_obtenido / maxPuntaje) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-400">
              {r.cantidad_items} {r.cantidad_items === 1 ? "item" : "items"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
