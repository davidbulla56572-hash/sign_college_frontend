import { ArrowLeft, Calendar, Mail, Hash, Trophy, User } from "lucide-react";

import type { AdminPostulacionDetalleCompleto } from "../api/admin.api";

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

type Props = {
  data: AdminPostulacionDetalleCompleto;
  onBack: () => void;
};

export function AdminPostulacionHeader({ data, onBack }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-soft">
      {/* Back button + title */}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-1 text-sm text-gray-500 transition hover:text-ink"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <h2 className="text-lg font-semibold text-ink">
          Revision de postulacion #{data.id_postulacion}
        </h2>
      </div>

      {/* Aspirant info */}
      <div className="grid gap-4 border-b border-gray-100 pb-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-gray-500">Aspirante:</span>
          <span className="font-medium text-ink">
            {data.aspirante_nombre} {data.aspirante_apellido}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Hash className="h-4 w-4 text-gray-400" />
          <span className="text-gray-500">Cedula:</span>
          <span className="font-medium text-ink">{data.aspirante_cedula}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-gray-500">Email:</span>
          <span className="font-medium text-ink">{data.aspirante_email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-500">Convocatoria:</span>
          <span className="font-medium text-ink">{data.titulo_convocatoria}</span>
        </div>
      </div>

      {/* Status row */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Estado:</span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              estadoColors[data.estado] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {estadoLabels[data.estado] ?? data.estado}
          </span>
        </div>

        {data.puntaje_total != null && (
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-gray-500">Puntaje total:</span>
            <span className="text-lg font-bold text-brand-700">
              {data.puntaje_total.toFixed(2)}
            </span>
          </div>
        )}

        {data.fecha_evaluacion && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500">Evaluado:</span>
            <span className="font-medium text-ink">
              {new Date(data.fecha_evaluacion).toLocaleDateString("es-CO")}
            </span>
          </div>
        )}

        <div className="ml-auto text-sm text-gray-500">
          {data.items.length} items
        </div>
      </div>
    </div>
  );
}
