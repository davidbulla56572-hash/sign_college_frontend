import { httpClient } from "../../../lib/api/httpClient";
import type {
  ActiveDraftResponse,
  ApplyResponse,
  HojaVidaDraftResponse,
  PostulacionFlowSummary,
  PostulacionSummary,
} from "../types/postulacion.types";
import type {
  HojaVidaProcesadaResponse,
  HojaVidaSavePayload,
} from "../../hoja-vida/types/hojaVida.types";

export async function listMyPostulaciones(): Promise<PostulacionSummary[]> {
  const response = await httpClient.get("/postulaciones/mine");
  return response.data;
}

export async function createOrRecoverDraft(): Promise<ActiveDraftResponse> {
  const response = await httpClient.post("/postulaciones/active-draft");
  return response.data;
}

export async function getHojaVidaDraft(
  postulacionId: number
): Promise<HojaVidaDraftResponse> {
  const response = await httpClient.get(
    `/hoja-vida/postulaciones/${postulacionId}`
  );
  return response.data;
}

export async function getPostulacionSummary(
  postulacionId: number,
): Promise<PostulacionFlowSummary> {
  const response = await httpClient.get(`/postulaciones/mine/${postulacionId}/summary`);
  return response.data;
}

export async function uploadCvWithinPostulacion(
  postulacionId: number,
  file: File
): Promise<HojaVidaProcesadaResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await httpClient.post(
    `/hoja-vida/postulaciones/${postulacionId}/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

export async function saveHojaVidaDraft(
  postulacionId: number,
  payload: HojaVidaSavePayload
): Promise<{ message: string }> {
  const response = await httpClient.put(
    `/hoja-vida/postulaciones/${postulacionId}`,
    sanitizePayload(payload)
  );
  return response.data;
}

export async function applyPostulacion(
  postulacionId: number
): Promise<ApplyResponse> {
  const response = await httpClient.patch(
    `/postulaciones/mine/${postulacionId}/apply`
  );
  return response.data;
}

function sanitizePayload(payload: HojaVidaSavePayload): HojaVidaSavePayload {
  return {
    ...payload,
    datos_personales: {
      ...payload.datos_personales,
      email: emptyToNull(payload.datos_personales.email),
      telefono: emptyToNull(payload.datos_personales.telefono),
      municipio: emptyToNull(payload.datos_personales.municipio),
      departamento: emptyToNull(payload.datos_personales.departamento),
    },
    items: Object.fromEntries(
      Object.entries(payload.items).map(([key, items]) => [
        key,
        items.map((item) => ({
          ...item,
          institucion: emptyToNull(item.institucion),
          fecha_inicio: emptyToNull(item.fecha_inicio),
          fecha_fin: emptyToNull(item.fecha_fin),
        })),
      ])
    ) as HojaVidaSavePayload["items"],
  };
}

function emptyToNull(value: string | null): string | null {
  return value && value.trim() ? value : null;
}
