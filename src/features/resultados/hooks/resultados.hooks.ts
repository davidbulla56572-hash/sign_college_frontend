import { useQuery } from "@tanstack/react-query";

import { resultadosApi } from "../api/resultados.api";

export function useMisResultadosQuery() {
  return useQuery({
    queryKey: ["resultados", "mine"],
    queryFn: resultadosApi.misResultados,
  });
}

export function useResultadoQuery(id: number) {
  return useQuery({
    queryKey: ["resultados", id],
    queryFn: () => resultadosApi.getById(id),
  });
}

export function usePostulacionStatusQuery(id: number) {
  return useQuery({
    queryKey: ["resultados", "status", id],
    queryFn: () => resultadosApi.getStatus(id),
  });
}

// -- Admin hooks (backward compat) --

export function useAdminRankingQuery(convocatoriaId: number) {
  return useQuery({
    queryKey: ["resultados", "ranking", convocatoriaId],
    queryFn: () => resultadosApi.getRanking(convocatoriaId),
    enabled: convocatoriaId > 0,
  });
}
