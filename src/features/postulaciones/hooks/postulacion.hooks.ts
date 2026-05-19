import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  applyPostulacion,
  createOrRecoverDraft,
  getHojaVidaDraft,
  listMyPostulaciones,
  saveHojaVidaDraft,
  uploadCvWithinPostulacion,
} from "../api/postulacion.api";
import type { HojaVidaSavePayload } from "../../hoja-vida/types/hojaVida.types";

export function useMyPostulacionesQuery() {
  return useQuery({
    queryKey: ["postulaciones", "mine"],
    queryFn: listMyPostulaciones,
  });
}

export function useCreateDraftMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrRecoverDraft,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["postulaciones"] });
    },
    onError: () => {
      toast.error("Error al iniciar la postulacion");
    },
  });
}

export function useHojaVidaDraftQuery(postulacionId: number | null) {
  return useQuery({
    queryKey: ["hoja-vida", "draft", postulacionId],
    queryFn: () => getHojaVidaDraft(postulacionId!),
    enabled: postulacionId != null,
  });
}

export function useUploadCvMutation(postulacionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadCvWithinPostulacion(postulacionId, file),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["hoja-vida", "draft", postulacionId],
      });
      toast.success("Hoja de vida procesada correctamente");
    },
    onError: () => {
      toast.error("Error al procesar la hoja de vida");
    },
  });
}

export function useSaveDraftMutation(postulacionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: HojaVidaSavePayload) =>
      saveHojaVidaDraft(postulacionId, payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ["hoja-vida", "draft", postulacionId],
      });
      toast.success(data.message ?? "Datos guardados correctamente");
    },
    onError: () => {
      toast.error("Error al guardar los datos");
    },
  });
}

export function useApplyMutation(postulacionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => applyPostulacion(postulacionId),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["postulaciones"] });
      void queryClient.invalidateQueries({
        queryKey: ["hoja-vida", "draft", postulacionId],
      });
      toast.success(data.mensaje);
    },
    onError: () => {
      toast.error("Error al enviar la postulacion");
    },
  });
}
