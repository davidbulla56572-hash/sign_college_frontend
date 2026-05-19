import { httpClient } from "../../../lib/api/httpClient";

type ConvocatoriaActivaResponse = {
  hay_convocatoria_activa: boolean;
  convocatoria: {
    id_convocatoria: number;
    titulo: string;
    descripcion: string | null;
    fecha_inicio: string;
    fecha_cierre: string;
    activa: boolean;
  } | null;
  mensaje: string | null;
};

export type { ConvocatoriaActivaResponse };

export const convocatoriaApi = {
  getActiva: (): Promise<ConvocatoriaActivaResponse> =>
    httpClient.get("/convocatorias/activa").then((r) => r.data),
};
