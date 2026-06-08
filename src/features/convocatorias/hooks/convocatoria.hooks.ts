import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { convocatoriasApi } from "../api/convocatoria.api";
import { reglasEvaluacionApi } from "../api/reglaEvaluacion.api";
import type { ConvocatoriaCreatePayload, ConvocatoriaUpdatePayload } from "../types/convocatoria.types";
import type { ReglaEvaluacionPayload } from "../types/reglaEvaluacion.types";

export function useConvocatoriasQuery() {
  return useQuery({
    queryKey: ["convocatorias"],
    queryFn: () => convocatoriasApi.list(),
  });
}

export function useAllConvocatoriasQuery() {
  return useQuery({
    queryKey: ["convocatorias", "all"],
    queryFn: () => convocatoriasApi.listAll(),
  });
}

export function useCreateConvocatoriaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: convocatoriasApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["convocatorias"] });
      toast.success("Convocatoria creada correctamente");
    },
    onError: () => {
      toast.error("Error al crear la convocatoria");
    },
  });
}

export function useUpdateConvocatoriaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ConvocatoriaUpdatePayload }) =>
      convocatoriasApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["convocatorias"] });
      toast.success("Convocatoria actualizada");
    },
    onError: () => {
      toast.error("Error al actualizar la convocatoria");
    },
  });
}

export function useActivateConvocatoriaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: convocatoriasApi.activate,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["convocatorias"] });
      toast.success("Convocatoria activada");
    },
    onError: () => {
      toast.error("Error al activar la convocatoria");
    },
  });
}

export function useCloseConvocatoriaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: convocatoriasApi.close,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["convocatorias"] });
      toast.success("Convocatoria cerrada");
    },
    onError: () => {
      toast.error("Error al cerrar la convocatoria");
    },
  });
}

export function useReglasConvocatoriaQuery(convocatoriaId: number | null) {
  return useQuery({
    queryKey: ["convocatorias", "reglas", convocatoriaId],
    queryFn: () => reglasEvaluacionApi.listByConvocatoria(convocatoriaId as number),
    enabled: convocatoriaId != null,
  });
}

export function useCreateReglaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      convocatoriaId,
      payload,
    }: {
      convocatoriaId: number;
      payload: ReglaEvaluacionPayload;
    }) => reglasEvaluacionApi.create(convocatoriaId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["convocatorias", "reglas", variables.convocatoriaId],
      });
      toast.success("Regla creada");
    },
    onError: () => {
      toast.error("Error al crear la regla");
    },
  });
}

export function useUpdateReglaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reglaId,
      convocatoriaId,
      payload,
    }: {
      reglaId: number;
      convocatoriaId: number;
      payload: Partial<ReglaEvaluacionPayload>;
    }) => reglasEvaluacionApi.update(reglaId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["convocatorias", "reglas", variables.convocatoriaId],
      });
      toast.success("Regla actualizada");
    },
    onError: () => {
      toast.error("Error al actualizar la regla");
    },
  });
}

export function useDeleteReglaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reglaId,
      convocatoriaId,
    }: {
      reglaId: number;
      convocatoriaId: number;
    }) => reglasEvaluacionApi.remove(reglaId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["convocatorias", "reglas", variables.convocatoriaId],
      });
      toast.success("Regla eliminada");
    },
    onError: () => {
      toast.error("Error al eliminar la regla");
    },
  });
}
