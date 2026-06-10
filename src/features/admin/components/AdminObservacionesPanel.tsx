import { useState } from "react";
import { MessageSquare, Save, X } from "lucide-react";

import { cn } from "../../../lib/utils/cn";
import { useSaveObservacionesMutation } from "../hooks/admin.hooks";

type Props = {
  postulacionId: number;
  observaciones: string | null;
};

export function AdminObservacionesPanel({ postulacionId, observaciones }: Props) {
  const saveObs = useSaveObservacionesMutation();
  const [value, setValue] = useState(observaciones ?? "");
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    saveObs.mutate(
      { postulacionId, payload: { observaciones_admin: value || null } },
      { onSuccess: () => setEditing(false) },
    );
  };

  const handleCancel = () => {
    setValue(observaciones ?? "");
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-ink">Observaciones administrativas</h3>
          </div>
          <button
            type="button"
            className="rounded-md px-2 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-50"
            onClick={() => setEditing(true)}
          >
            {observaciones ? "Editar" : "Agregar"}
          </button>
        </div>
        <div className="px-5 py-4">
          {observaciones ? (
            <p className="whitespace-pre-wrap text-sm text-ink">{observaciones}</p>
          ) : (
            <p className="text-sm italic text-gray-400">Sin observaciones</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-white shadow-soft transition",
        saveObs.isPending
          ? "border-brand-200"
          : "border-gray-200",
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-ink">
            {observaciones ? "Editar observaciones" : "Agregar observaciones"}
          </h3>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 transition hover:bg-gray-100"
          onClick={handleCancel}
          disabled={saveObs.isPending}
        >
          <X className="h-3.5 w-3.5" />
          Cancelar
        </button>
      </div>
      <div className="p-5">
        <textarea
          className="w-full rounded-md border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          rows={4}
          placeholder="Escriba sus observaciones sobre esta postulacion..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={saveObs.isPending}
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
            onClick={handleCancel}
            disabled={saveObs.isPending}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white transition",
              saveObs.isPending
                ? "bg-brand-400 cursor-not-allowed"
                : "bg-brand-700 hover:bg-brand-600",
            )}
            onClick={handleSave}
            disabled={saveObs.isPending}
          >
            <Save className="h-3.5 w-3.5" />
            {saveObs.isPending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
