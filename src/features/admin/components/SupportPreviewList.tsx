import { FileText, Paperclip } from "lucide-react";

import type { AdminItemSoporte } from "../api/admin.api";

const VITE_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

type Props = {
  soportes: AdminItemSoporte[];
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SupportPreviewList({ soportes }: Props) {
  if (soportes.length === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Paperclip className="h-3.5 w-3.5" />
        Sin soportes
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {soportes.map((s) => {
        const fileUrl = `${VITE_API_BASE_URL.replace("/api/v1", "")}/${s.url_archivo}`;
        return (
          <a
            key={s.id_soporte}
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition hover:bg-gray-100"
          >
            <FileText className="h-4 w-4 text-brand-700" />
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-ink">{s.nombre_archivo}</p>
              <p className="text-xs text-gray-500">
                {formatBytes(s.tamanio_bytes)} &middot;{" "}
                {new Date(s.fecha_carga).toLocaleDateString("es-CO")}
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
