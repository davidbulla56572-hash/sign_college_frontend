import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { adminApi } from "../api/admin.api";
import type { AdminPostulacionStatus } from "../api/admin.api";

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
