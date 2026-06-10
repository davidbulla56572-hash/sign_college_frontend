import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { adminApi } from "../api/admin.api";
import type {
  AdminPostulacionStatus,
  ObservacionesPayload,
} from "../api/admin.api";

type PostulacionSummary = {
  id_postulacion: number;
  id_convocatoria: number;
  titulo_convocatoria: string | null;
  estado: string;
  puntaje_total: number | null;
  fecha_envio: string | null;
};

export function useAspirantesQuery() {
  return useQuery({
    queryKey: ["admin", "aspirantes"],
    queryFn: adminApi.listAspirantes,
  });
}

export function useAspirantDetailQuery(userId: number) {
  return useQuery({
    queryKey: ["admin", "aspirant", userId],
    queryFn: () => adminApi.getAspirantDetail(userId),
    enabled: userId > 0,
  });
}

export function usePostulacionDetalleQuery(id: number) {
  return useQuery({
    queryKey: ["admin", "postulacion", id],
    queryFn: () => adminApi.getPostulacionDetalle(id),
    enabled: id > 0,
  });
}

export function useAllPostulacionesQuery(estado?: string) {
  return useQuery<PostulacionSummary[]>({
    queryKey: ["admin", "postulaciones", estado],
    queryFn: () => adminApi.getAllPostulaciones(estado),
  });
}

export function useUpdatePostulacionStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: AdminPostulacionStatus;
    }) => adminApi.updatePostulacionStatus(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      void queryClient.invalidateQueries({ queryKey: ["resultados"] });
      void queryClient.invalidateQueries({ queryKey: ["postulaciones"] });
      toast.success("Estado actualizado");
    },
    onError: () => {
      toast.error("Error al actualizar el estado");
    },
  });
}

// -- Phase 13 hooks --

export function usePostulacionReviewQuery(id: number) {
  return useQuery({
    queryKey: ["admin", "postulacion", "review", id],
    queryFn: () => adminApi.getPostulacionReview(id),
    enabled: id > 0,
  });
}

export function useToggleItemValidationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => adminApi.toggleItemValidation(itemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "postulacion", "review"] });
      toast.success("Validacion del item actualizada");
    },
    onError: () => {
      toast.error("Error al actualizar la validacion");
    },
  });
}

export function useSaveObservacionesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postulacionId,
      payload,
    }: {
      postulacionId: number;
      payload: ObservacionesPayload;
    }) => adminApi.saveObservaciones(postulacionId, payload),
    onSuccess: (_, { postulacionId }) => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "postulacion", "review", postulacionId] });
      toast.success("Observaciones guardadas");
    },
    onError: () => {
      toast.error("Error al guardar las observaciones");
    },
  });
}

export function useItemSoportesQuery(itemId: number) {
  return useQuery({
    queryKey: ["admin", "item", "soportes", itemId],
    queryFn: () => adminApi.getItemSoportes(itemId),
    enabled: itemId > 0,
  });
}

export function useEvaluationTraceQuery(postulacionId: number) {
  return useQuery({
    queryKey: ["admin", "postulacion", "trace", postulacionId],
    queryFn: () => adminApi.getEvaluationTrace(postulacionId),
    enabled: postulacionId > 0,
  });
}

// -- Fase 14 hooks --

export function useRecalculateEvaluationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postulacionId: number) =>
      adminApi.recalculateEvaluation(postulacionId),
    onSuccess: (_, postulacionId) => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "postulacion", "review", postulacionId] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "postulacion", "trace", postulacionId] });
      toast.success("Evaluacion recalculada");
    },
    onError: () => {
      toast.error("Error al recalcular la evaluacion");
    },
  });
}

export function useEvaluarPostulacionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postulacionId: number) =>
      adminApi.evaluarPostulacion(postulacionId),
    onSuccess: (_, postulacionId) => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "postulacion", "review", postulacionId] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "postulacion", "trace", postulacionId] });
      void queryClient.invalidateQueries({ queryKey: ["resultados"] });
      toast.success("Evaluacion ejecutada");
    },
    onError: () => {
      toast.error("Error al evaluar la postulacion");
    },
  });
}
