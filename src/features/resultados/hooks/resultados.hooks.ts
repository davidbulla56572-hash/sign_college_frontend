import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

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

export function useAdminRankingQuery(convocatoriaId: number) {
  return useQuery({
    queryKey: ["resultados", "ranking", convocatoriaId],
    queryFn: () => resultadosApi.getRanking(convocatoriaId),
    enabled: convocatoriaId > 0,
  });
}

export function useEvaluarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resultadosApi.evaluar,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["resultados"] });
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      void queryClient.invalidateQueries({ queryKey: ["postulaciones"] });
      toast.success("Evaluacion completada");
    },
    onError: () => {
      toast.error("Error al evaluar la postulacion");
    },
  });
}
