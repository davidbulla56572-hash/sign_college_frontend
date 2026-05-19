import { httpClient } from "../../../lib/api/httpClient";

type DetalleItemResultado = {
  id_item: number;
  tipo_item: string;
  descripcion: string;
  puntaje_asignado: number;
};

type ConvocatoriaRef = {
  id_convocatoria: number;
  titulo: string;
};

type MiResultado = {
  id_postulacion: number;
  estado: string;
  puntaje_total: number | null;
  fecha_evaluacion: string | null;
  convocatoria: ConvocatoriaRef;
  detalle: DetalleItemResultado[];
};

type RankingEntry = {
  id_postulacion: number;
  id_usuario: number;
  aspirante: string;
  cedula: string;
  estado: string;
  puntaje_total: number | null;
  convocatoria: string;
  fecha_evaluacion: string | null;
};

type RankingResponse = {
  id_convocatoria: number;
  titulo_convocatoria: string;
  items: RankingEntry[];
  total: number;
};

export type {
  DetalleItemResultado,
  ConvocatoriaRef,
  MiResultado,
  RankingEntry,
  RankingResponse,
};

export const resultadosApi = {
  misResultados: (): Promise<MiResultado[]> =>
    httpClient.get("/resultados/mis-resultados").then((r) => r.data),

  getById: (id: number): Promise<MiResultado> =>
    httpClient.get(`/resultados/${id}`).then((r) => r.data),

  getRanking: (convocatoriaId: number): Promise<RankingResponse> =>
    httpClient
      .get(`/resultados/ranking/${convocatoriaId}`)
      .then((r) => r.data),

  evaluar: (id: number): Promise<MiResultado> =>
    httpClient.post(`/resultados/${id}/evaluar`).then((r) => r.data),
};
