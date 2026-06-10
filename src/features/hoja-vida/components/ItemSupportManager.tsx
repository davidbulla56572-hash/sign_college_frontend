import type { ChangeEvent } from "react";

import { Button } from "../../../components/ui";
import {
  useDeleteItemSoporteMutation,
  useItemSoportesQuery,
  useUploadItemSoporteMutation,
} from "../hooks/soportes.hooks";

type ItemSupportManagerProps = {
  itemId?: number | null;
};

export function ItemSupportManager({ itemId }: ItemSupportManagerProps) {
  const { data: soportes, isLoading } = useItemSoportesQuery(itemId);
  const uploadMutation = useUploadItemSoporteMutation(itemId ?? 0);
  const deleteMutation = useDeleteItemSoporteMutation(itemId ?? 0);

  if (!itemId) {
    return (
      <div className="mt-4 rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500">
        Guarda el borrador para habilitar la carga de soportes en este item.
      </div>
    );
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    uploadMutation.mutate(file);
    event.target.value = "";
  };

  return (
    <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Soportes documentales</p>
          <p className="text-xs text-gray-500">
            Adjunta certificados, constancias o evidencia relacionada con este item.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-brand-sm border border-border bg-white px-4 py-2 text-sm font-medium text-ink">
          Cargar soporte
          <input
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            onChange={handleFileChange}
            disabled={uploadMutation.isPending}
          />
        </label>
      </div>

      {isLoading ? <p className="mt-3 text-sm text-gray-500">Cargando soportes...</p> : null}

      {!isLoading && (!soportes || soportes.length === 0) ? (
        <p className="mt-3 text-sm text-gray-500">Aun no hay soportes cargados para este item.</p>
      ) : null}

      {soportes && soportes.length > 0 ? (
        <div className="mt-3 space-y-2">
          {soportes.map((soporte) => (
            <div
              key={soporte.id_soporte}
              className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-ink">{soporte.nombre_archivo}</p>
                <p className="text-xs text-gray-500">
                  {(soporte.tamanio_bytes / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href={`/${soporte.url_archivo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-brand-700"
                >
                  Ver
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto px-0 py-0 text-sm text-red-600"
                  onClick={() => deleteMutation.mutate(soporte.id_soporte)}
                  disabled={deleteMutation.isPending}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
