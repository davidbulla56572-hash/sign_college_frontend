import { useState } from "react";

import { Card, EmptyState } from "../../../components/ui";
import { useAllConvocatoriasQuery } from "../../convocatorias/hooks/convocatoria.hooks";
import { RankingTable } from "../components/RankingTable";
import { useAdminRankingQuery } from "../../resultados/hooks/resultados.hooks";

export function RankingPage() {
  const { data: convocatorias, isLoading: loadingConv } =
    useAllConvocatoriasQuery();
  const [selectedConvId, setSelectedConvId] = useState<number | null>(
    convocatorias?.[0]?.id_convocatoria ?? null,
  );

  const { data: rankingData, isLoading: loadingRanking } =
    useAdminRankingQuery(selectedConvId ?? 0);

  if (loadingConv) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!convocatorias || convocatorias.length === 0) {
    return (
      <EmptyState
        title="Sin convocatorias"
        description="No hay convocatorias para mostrar ranking."
      />
    );
  }

  const selectedConv = convocatorias.find(
    (c) => c.id_convocatoria === selectedConvId,
  );

  if (loadingRanking) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Cargando ranking...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label htmlFor="conv-select" className="text-sm font-medium text-gray-700">
          Convocatoria:
        </label>
        <select
          id="conv-select"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          value={selectedConvId ?? ""}
          onChange={(e) => setSelectedConvId(Number(e.target.value))}
        >
          {convocatorias.map((c) => (
            <option key={c.id_convocatoria} value={c.id_convocatoria}>
              {c.titulo}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <h3 className="mb-4 text-base font-semibold text-ink">
          Ranking - {selectedConv?.titulo ?? ""}
        </h3>
        {rankingData && rankingData.items.length > 0 ? (
          <RankingTable items={rankingData.items} />
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
            No hay postulaciones para esta convocatoria
          </div>
        )}
      </Card>
    </div>
  );
}
