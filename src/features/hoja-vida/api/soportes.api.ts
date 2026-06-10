import { httpClient } from "../../../lib/api/httpClient";
import type { SoporteItem } from "../types/hojaVida.types";

export async function listItemSoportes(itemId: number): Promise<SoporteItem[]> {
  const response = await httpClient.get(`/hoja-vida/items/${itemId}/soportes`);
  return response.data;
}

export async function uploadItemSoporte(
  itemId: number,
  file: File,
): Promise<SoporteItem> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await httpClient.post(`/hoja-vida/items/${itemId}/soportes`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteItemSoporte(soporteId: number): Promise<void> {
  await httpClient.delete(`/hoja-vida/soportes/${soporteId}`);
}
