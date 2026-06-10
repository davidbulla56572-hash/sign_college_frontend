import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, Search } from "lucide-react";

import { cn } from "../../../lib/utils/cn";
import type { RankingEntry } from "../../resultados/api/resultados.api";

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

type SortField = "puntaje" | "nombre" | "estado";
type SortDir = "asc" | "desc";

function EstadoBadge({ estado }: { estado: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        estadoColors[estado] ?? "bg-gray-100 text-gray-600",
      )}
    >
      {estadoLabels[estado] ?? estado}
    </span>
  );
}

export function RankingTable({
  items,
}: {
  items: RankingEntry[];
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("puntaje");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "puntaje" ? "desc" : "asc");
    }
  };

  const filtered = useMemo(() => {
    let result = [...items];

    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.aspirante.toLowerCase().includes(q) ||
          e.cedula.includes(q),
      );
    }

    // Filter by estado
    if (filterEstado) {
      result = result.filter((e) => e.estado === filterEstado);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "puntaje") {
        cmp = (a.puntaje_total ?? 0) - (b.puntaje_total ?? 0);
      } else if (sortField === "nombre") {
        cmp = a.aspirante.localeCompare(b.aspirante);
      } else if (sortField === "estado") {
        cmp = a.estado.localeCompare(b.estado);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [items, search, filterEstado, sortField, sortDir]);

  const estados = useMemo(
    () => [...new Set(items.map((e) => e.estado))].sort(),
    [items],
  );

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        No hay postulaciones para esta convocatoria
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o cedula..."
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          {estados.map((e) => (
            <option key={e} value={e}>
              {estadoLabels[e] ?? e}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-soft">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Posicion
              </th>
              <th
                className="cursor-pointer px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
                onClick={() => toggleSort("nombre")}
              >
                <span className="flex items-center gap-1">
                  Aspirante
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Cedula
              </th>
              <th
                className="cursor-pointer px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
                onClick={() => toggleSort("estado")}
              >
                <span className="flex items-center gap-1">
                  Estado
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th
                className="cursor-pointer px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
                onClick={() => toggleSort("puntaje")}
              >
                <span className="flex items-center gap-1">
                  Puntaje
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-sm text-gray-500"
                >
                  No se encontraron resultados con los filtros aplicados
                </td>
              </tr>
            ) : (
              filtered.map((entry, idx) => (
                <tr
                  key={entry.id_postulacion}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/admin/postulacion/${entry.id_postulacion}`)}
                >
                  <td className="px-5 py-3 text-sm font-semibold text-ink">
                    #{idx + 1}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-ink">
                    {entry.aspirante}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {entry.cedula}
                  </td>
                  <td className="px-5 py-3 text-sm">
                    <EstadoBadge estado={entry.estado} />
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-brand-700">
                    {entry.puntaje_total != null
                      ? entry.puntaje_total.toFixed(2)
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="border-t border-gray-200 px-5 py-2 text-xs text-gray-500">
          Mostrando {filtered.length} de {items.length} postulaciones
        </div>
      </div>
    </div>
  );
}
