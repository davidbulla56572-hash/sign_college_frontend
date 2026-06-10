import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  deleteItemSoporte,
  listItemSoportes,
  uploadItemSoporte,
} from "../api/soportes.api";

export function useItemSoportesQuery(itemId: number | null | undefined) {
  return useQuery({
    queryKey: ["hoja-vida", "item-soportes", itemId],
    queryFn: () => listItemSoportes(itemId as number),
    enabled: itemId != null,
  });
}

export function useUploadItemSoporteMutation(itemId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadItemSoporte(itemId, file),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["hoja-vida", "item-soportes", itemId],
      });
      toast.success("Soporte cargado correctamente");
    },
    onError: () => {
      toast.error("Error al cargar el soporte");
    },
  });
}

export function useDeleteItemSoporteMutation(itemId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (soporteId: number) => deleteItemSoporte(soporteId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["hoja-vida", "item-soportes", itemId],
      });
      toast.success("Soporte eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar el soporte");
    },
  });
}
