import { FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";

export function ResultadoEmptyState() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white px-8 py-12 text-center shadow-soft">
      <FileQuestion className="mb-4 h-12 w-12 text-gray-300" />
      <h3 className="text-base font-semibold text-ink">
        Sin resultados disponibles
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        No hay postulaciones registradas. Cuando te postules a una convocatoria
        y esta sea evaluada, aqui podras ver tu puntaje y el detalle de tu
        evaluacion.
      </p>
      <Link
        to="/dashboard"
        className="mt-5 inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
      >
        Ver convocatorias
      </Link>
    </div>
  );
}
