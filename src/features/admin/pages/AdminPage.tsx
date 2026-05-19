import { useState } from "react";
import { Users, FileText, Trophy, CalendarDays } from "lucide-react";

import { Card, PageContainer } from "../../../components/ui";
import { cn } from "../../../lib/utils/cn";
import {
  useAspirantesQuery,
  useAllPostulacionesQuery,
} from "../../admin/hooks/admin.hooks";
import { AspirantDetailPage } from "./AspirantDetailPage";
import { RankingPage } from "./RankingPage";
import { ConvocatoriasAdminPage } from "./ConvocatoriasAdminPage";
import { RankingTable } from "../components/RankingTable";
import type { RankingEntry } from "../../resultados/api/resultados.api";

type AdminTab = "aspirantes" | "postulaciones" | "ranking" | "convocatorias";

const tabs: { key: AdminTab; label: string; icon: typeof Users }[] = [
  { key: "aspirantes", label: "Aspirantes", icon: Users },
  { key: "postulaciones", label: "Postulaciones", icon: FileText },
  { key: "ranking", label: "Ranking", icon: Trophy },
  { key: "convocatorias", label: "Convocatorias", icon: CalendarDays },
];

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

function AspirantesListPage() {
  const { data: aspirantes, isLoading } = useAspirantesQuery();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (selectedId) {
    return (
      <AspirantDetailPage
        userId={selectedId}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Cargando aspirantes...</p>
      </div>
    );
  }

  if (!aspirantes || aspirantes.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        No hay aspirantes registrados
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-soft">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Nombre
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Cedula
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Email
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Municipio
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Registro
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {aspirantes.map((a) => (
            <tr key={a.id_usuario} className="hover:bg-gray-50">
              <td className="px-5 py-3 text-sm font-medium text-ink">
                {a.nombre} {a.apellido}
              </td>
              <td className="px-5 py-3 text-sm text-gray-600">{a.cedula}</td>
              <td className="px-5 py-3 text-sm text-gray-600">{a.email}</td>
              <td className="px-5 py-3 text-sm text-gray-500">
                {a.municipio ?? "—"}
              </td>
              <td className="px-5 py-3 text-sm text-gray-500">
                {new Date(a.fecha_registro).toLocaleDateString("es-CO")}
              </td>
              <td className="px-5 py-3 text-sm">
                <button
                  type="button"
                  className="text-brand-700 hover:text-brand-600 font-medium"
                  onClick={() => setSelectedId(a.id_usuario)}
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PostulacionesAdminList() {
  const { data, isLoading } = useAllPostulacionesQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Cargando postulaciones...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        No hay postulaciones registradas
      </div>
    );
  }

  // Transform to ranking entries for the table
  const rankingItems: RankingEntry[] = data.map((p) => ({
    id_postulacion: p.id_postulacion,
    id_usuario: 0,
    aspirante: p.titulo_convocatoria ?? "Sin titulo",
    cedula: "",
    estado: p.estado,
    puntaje_total: p.puntaje_total,
    convocatoria: p.titulo_convocatoria ?? "",
    fecha_evaluacion: null,
  }));

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-soft">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              #
            </th>
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
          {data.map((p, idx) => (
            <tr key={p.id_postulacion} className="hover:bg-gray-50">
              <td className="px-5 py-3 text-sm font-semibold text-ink">
                #{idx + 1}
              </td>
              <td className="px-5 py-3 text-sm font-medium text-ink">
                {p.titulo_convocatoria ?? "Sin titulo"}
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
              <td className="px-5 py-3 text-sm font-semibold text-brand-700">
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
  );
}

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("aspirantes");

  return (
    <PageContainer>
      <div>
        <h2 className="text-xl font-semibold text-ink">Panel administrativo</h2>
        <p className="mt-1 text-sm text-gray-500">
          Gestion de aspirantes, postulaciones y convocatorias
        </p>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition",
                activeTab === tab.key
                  ? "border-brand-700 text-brand-700"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="pt-4">
        {activeTab === "aspirantes" && <AspirantesListPage />}
        {activeTab === "postulaciones" && <PostulacionesAdminList />}
        {activeTab === "ranking" && <RankingPage />}
        {activeTab === "convocatorias" && <ConvocatoriasAdminPage />}
      </div>
    </PageContainer>
  );
}
