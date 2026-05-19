import { httpClient } from "../../../lib/api/httpClient";

type AspirantSummary = {
  id_usuario: number;
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string | null;
  municipio: string | null;
  departamento: string | null;
  fecha_registro: string;
};

type AspirantDetail = {
  id_usuario: number;
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string | null;
  municipio: string | null;
  departamento: string | null;
  pais: string | null;
  postulaciones: {
    id_postulacion: number;
    titulo_convocatoria: string;
    estado: string;
    puntaje_total: number | null;
    fecha_envio: string | null;
  }[];
};

type SoporteItem = {
  id_soporte: number;
  id_item: number;
  nombre_archivo: string;
  url_archivo: string;
  tipo_archivo: string;
  tamanio_bytes: number;
  fecha_carga: string;
};

type AdminPostulacionDetalle = {
  id_postulacion: number;
  id_usuario: number;
  aspirante_nombre: string;
  aspirante_apellido: string;
  aspirante_cedula: string;
  titulo_convocatoria: string;
  estado: string;
  puntaje_total: number | null;
  url_cv_original: string | null;
  observaciones_admin: string | null;
  fecha_envio: string | null;
  fecha_evaluacion: string | null;
  total_items: number;
  soportes: SoporteItem[];
};

type AdminPostulacionStatus = {
  estado: string;
  observaciones_admin: string | null;
};

export type { AspirantSummary, AspirantDetail, AdminPostulacionDetalle, AdminPostulacionStatus, SoporteItem };

export const adminApi = {
  listAspirantes: (): Promise<AspirantSummary[]> =>
    httpClient.get("/admin/aspirantes").then((r) => r.data),

  getAspirantDetail: (userId: number): Promise<AspirantDetail> =>
    httpClient.get(`/admin/aspirantes/${userId}`).then((r) => r.data),

  getPostulacionDetalle: (id: number): Promise<AdminPostulacionDetalle> =>
    httpClient.get(`/admin/postulaciones/${id}/detalle`).then((r) => r.data),

  updatePostulacionStatus: (
    id: number,
    payload: AdminPostulacionStatus,
  ): Promise<AdminPostulacionDetalle> =>
    httpClient.patch(`/postulaciones/${id}/estado`, payload).then((r) => r.data),

  getAllPostulaciones: (estado?: string): Promise<{
    id_postulacion: number;
    id_convocatoria: number;
    titulo_convocatoria: string | null;
    estado: string;
    puntaje_total: number | null;
    fecha_envio: string | null;
  }[]> => {
    const params = estado ? { estado } : {};
    return httpClient.get("/postulaciones/todas", { params }).then((r) => r.data);
  },

  listAllConvocatorias: () =>
    httpClient.get("/convocatorias/todas").then((r) => r.data),
};
