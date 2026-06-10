import { Building2, Calendar, Hash } from "lucide-react";

import type { AdminItemDetalle } from "../api/admin.api";
import { ItemValidationToggle } from "./ItemValidationToggle";
import { SupportPreviewList } from "./SupportPreviewList";

const tipoItemLabels: Record<string, string> = {
  FORMACION: "Formacion",
  EXPERIENCIA: "Experiencia",
  PRODUCCION: "Produccion",
  PONENCIA: "Ponencia",
  INVESTIGACION: "Investigacion",
  DOCUMENTO: "Documento",
  OTRO: "Otro",
};

const tipoItemColors: Record<string, string> = {
  FORMACION: "bg-blue-50 text-blue-700",
  EXPERIENCIA: "bg-green-50 text-green-700",
  PRODUCCION: "bg-purple-50 text-purple-700",
  PONENCIA: "bg-amber-50 text-amber-700",
  INVESTIGACION: "bg-cyan-50 text-cyan-700",
  DOCUMENTO: "bg-gray-100 text-gray-600",
  OTRO: "bg-gray-100 text-gray-600",
};

type Props = {
  item: AdminItemDetalle;
  onToggleValidation: (itemId: number) => void;
  validatingId: number | null;
};

export function AdminItemReviewCard({ item, onToggleValidation, validatingId }: Props) {
  const isPending = validatingId === item.id_item;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-soft">
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              tipoItemColors[item.tipo_item] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {tipoItemLabels[item.tipo_item] ?? item.tipo_item}
          </span>
          <span className="text-xs text-gray-400">#{item.id_item}</span>
        </div>
        <ItemValidationToggle
          validado={item.validado}
          onToggle={() => onToggleValidation(item.id_item)}
          disabled={isPending}
        />
      </div>

      {/* Description */}
      <p className="mb-3 text-sm font-medium text-ink">{item.descripcion}</p>

      {/* Metadata */}
      <div className="mb-3 grid gap-2 text-xs text-gray-500 sm:grid-cols-2 lg:grid-cols-4">
        {item.institucion && (
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-gray-400" />
            <span>{item.institucion}</span>
          </div>
        )}
        {item.fecha_inicio && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>
              {new Date(item.fecha_inicio).toLocaleDateString("es-CO")}
              {item.fecha_fin
                ? ` - ${new Date(item.fecha_fin).toLocaleDateString("es-CO")}`
                : " - Actual"}
            </span>
          </div>
        )}
        {item.cantidad != null && (
          <div className="flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5 text-gray-400" />
            <span>Cantidad: {item.cantidad}</span>
          </div>
        )}
        {item.puntaje_asignado != null && (
          <div className="flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5 text-brand-700" />
            <span className="font-semibold text-brand-700">
              Puntaje: {item.puntaje_asignado.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Soportes */}
      <SupportPreviewList soportes={item.soportes} />
    </div>
  );
}
