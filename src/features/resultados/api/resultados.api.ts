import { httpClient } from "../../../lib/api/httpClient";
import type {
  MiResultado,
  PostulacionStatus,
} from "../types/resultados.types";

// -- Admin types (backward compat) --

export type RankingEntry = {
  id_postulacion: number;
  id_usuario: number;
  aspirante: string;
  cedula: string;
  estado: string;
  puntaje_total: number | null;
  convocatoria: string;
  fecha_evaluacion: string | null;
};

export type RankingResponse = {
  id_convocatoria: number;
  titulo_convocatoria: string;
  items: RankingEntry[];
  total: number;
};

export const resultadosApi = {
  misResultados: (): Promise<MiResultado[]> =>
    httpClient.get("/resultados/mis-resultados").then((r) => r.data),

  getById: (id: number): Promise<MiResultado> =>
    httpClient.get(`/resultados/postulaciones/${id}`).then((r) => r.data),

  getStatus: (id: number): Promise<PostulacionStatus> =>
    httpClient.get(`/resultados/postulaciones/${id}/status`).then((r) => r.data),

  // Admin (legacy)
  getRanking: (convocatoriaId: number): Promise<RankingResponse> =>
    httpClient
      .get(`/resultados/ranking/${convocatoriaId}`)
      .then((r) => r.data),

  evaluar: (id: number): Promise<MiResultado> =>
    httpClient.post(`/resultados/${id}/evaluar`).then((r) => r.data),
};
