import { ArrowLeft } from "lucide-react";

import { Card, PageContainer } from "../../../components/ui";
import { Button } from "../../../components/ui/Button";
import { useAspirantDetailQuery } from "../../admin/hooks/admin.hooks";

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

interface AspirantDetailPageProps {
  userId: number;
  onBack: () => void;
}

export function AspirantDetailPage({ userId, onBack }: AspirantDetailPageProps) {
  const { data, isLoading } = useAspirantDetailQuery(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Cargando detalle...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        No se encontro el aspirante
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="h-auto px-0 py-0 text-sm text-gray-600">
        <ArrowLeft className="mr-1 h-4 w-4" /> Volver a la lista
      </Button>

      <Card>
        <h3 className="text-lg font-semibold text-ink">
          {data.nombre} {data.apellido}
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium text-gray-500">Cedula:</span>{" "}
            {data.cedula}
          </div>
          <div>
            <span className="font-medium text-gray-500">Email:</span>{" "}
            {data.email}
          </div>
          <div>
            <span className="font-medium text-gray-500">Telefono:</span>{" "}
            {data.telefono ?? "—"}
          </div>
          <div>
            <span className="font-medium text-gray-500">Ubicacion:</span>{" "}
            {data.municipio ? `${data.municipio}, ${data.departamento}` : "—"}
          </div>
        </div>
      </Card>

      <div>
        <h4 className="mb-3 text-base font-semibold text-ink">Postulaciones</h4>
        {data.postulaciones.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
            Sin postulaciones
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white shadow-soft">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Convocatoria
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Puntaje
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Envio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.postulaciones.map((p) => (
                  <tr key={p.id_postulacion} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-ink">
                      {p.titulo_convocatoria}
                    </td>
                    <td className="px-5 py-3 text-sm">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          estadoColors[p.estado] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {estadoLabels[p.estado] ?? p.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {p.puntaje_total != null
                        ? p.puntaje_total.toFixed(2)
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {p.fecha_envio
                        ? new Date(p.fecha_envio).toLocaleDateString("es-CO")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
