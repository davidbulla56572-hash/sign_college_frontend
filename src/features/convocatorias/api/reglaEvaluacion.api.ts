import { httpClient } from "../../../lib/api/httpClient";
import type {
  ReglaEvaluacion,
  ReglaEvaluacionPayload,
} from "../types/reglaEvaluacion.types";

export const reglasEvaluacionApi = {
  listByConvocatoria: (convocatoriaId: number): Promise<ReglaEvaluacion[]> =>
    httpClient.get(`/reglas/convocatorias/${convocatoriaId}`).then((r) => r.data),

  create: (
    convocatoriaId: number,
    payload: ReglaEvaluacionPayload,
  ): Promise<ReglaEvaluacion> =>
    httpClient.post(`/reglas/convocatorias/${convocatoriaId}`, payload).then((r) => r.data),

  update: (
    reglaId: number,
    payload: Partial<ReglaEvaluacionPayload>,
  ): Promise<ReglaEvaluacion> =>
    httpClient.patch(`/reglas/${reglaId}`, payload).then((r) => r.data),

  remove: (reglaId: number): Promise<void> =>
    httpClient.delete(`/reglas/${reglaId}`).then(() => undefined),
};
