import { Award } from "lucide-react";

export function ResultadoPuntajeCard({
  puntaje,
}: {
  puntaje: number | null;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-gradient-to-br from-brand-50 to-white px-6 py-5 text-center shadow-soft">
      <Award className="mb-2 h-6 w-6 text-brand-600" />
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
        Puntaje total
      </p>
      <p className="mt-1 text-3xl font-bold text-brand-700">
        {puntaje != null ? puntaje.toFixed(2) : "—"}
      </p>
      {puntaje != null && (
        <p className="mt-1 text-xs text-gray-400">puntos</p>
      )}
    </div>
  );
}
