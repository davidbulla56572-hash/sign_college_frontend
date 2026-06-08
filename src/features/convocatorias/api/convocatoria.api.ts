import { httpClient } from "../../../lib/api/httpClient";
import type {
  ConvocatoriaCreatePayload,
  ConvocatoriaDetail,
  ConvocatoriaSummary,
  ConvocatoriaUpdatePayload,
} from "../types/convocatoria.types";

export const convocatoriasApi = {
  list: (): Promise<ConvocatoriaSummary[]> =>
    httpClient.get("/convocatorias").then((r) => r.data),

  listAll: (): Promise<ConvocatoriaDetail[]> =>
    httpClient.get("/convocatorias/todas").then((r) => r.data),

  getById: (id: number): Promise<ConvocatoriaDetail> =>
    httpClient.get(`/convocatorias/${id}`).then((r) => r.data),

  create: (payload: ConvocatoriaCreatePayload): Promise<ConvocatoriaDetail> =>
    httpClient.post("/convocatorias", payload).then((r) => r.data),

  update: (
    id: number,
    payload: ConvocatoriaUpdatePayload,
  ): Promise<ConvocatoriaDetail> =>
    httpClient.put(`/convocatorias/${id}`, payload).then((r) => r.data),

  activate: (id: number): Promise<ConvocatoriaDetail> =>
    httpClient.patch(`/convocatorias/${id}/activate`).then((r) => r.data),

  close: (id: number): Promise<ConvocatoriaDetail> =>
    httpClient.patch(`/convocatorias/${id}/close`).then((r) => r.data),
};
