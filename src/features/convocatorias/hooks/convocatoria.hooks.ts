import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { convocatoriasApi } from "../api/convocatoria.api";
import type { ConvocatoriaCreatePayload, ConvocatoriaUpdatePayload } from "../types/convocatoria.types";

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

export function useToggleConvocatoriaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: convocatoriasApi.toggle,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["convocatorias"] });
      toast.success("Estado de convocatoria actualizado");
    },
    onError: () => {
      toast.error("Error al actualizar el estado");
    },
  });
}
