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

// -- Phase 13: Full admin review with items + nested soportes --

type AdminItemSoporte = {
  id_soporte: number;
  nombre_archivo: string;
  url_archivo: string;
  tipo_archivo: string;
  tamanio_bytes: number;
  fecha_carga: string;
};

type AdminItemDetalle = {
  id_item: number;
  tipo_item: string;
  descripcion: string;
  institucion: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  cantidad: number | null;
  puntaje_asignado: number | null;
  validado: boolean;
  soportes: AdminItemSoporte[];
};

type AdminPostulacionDetalleCompleto = {
  id_postulacion: number;
  id_usuario: number;
  aspirante_nombre: string;
  aspirante_apellido: string;
  aspirante_cedula: string;
  aspirante_email: string;
  id_convocatoria: number;
  titulo_convocatoria: string;
  estado: string;
  puntaje_total: number | null;
  fecha_envio: string | null;
  fecha_evaluacion: string | null;
  observaciones_admin: string | null;
  items: AdminItemDetalle[];
};

// -- Phase 13: Item validation --

type ItemValidationResponse = {
  id_item: number;
  validado: boolean;
  tipo_item: string;
  descripcion: string;
};

// -- Phase 13: Observaciones --

type ObservacionesPayload = {
  observaciones_admin: string | null;
};

type ObservacionesResponse = {
  id_postulacion: number;
  observaciones_admin: string | null;
};

// -- Phase 13: Evaluation trace --

type ReglaAplicadaInfo = {
  id_regla: number;
  descripcion_regla: string;
};

type EvaluationTraceItem = {
  id_item: number;
  tipo_item: string;
  descripcion: string;
  cantidad: number;
  puntaje_unitario: number;
  maximo_acumulable: number | null;
  puntaje_asignado: number;
  regla_aplicada: ReglaAplicadaInfo | null;
  sin_regla: boolean;
};

type EvaluationTraceResponse = {
  id_postulacion: number;
  id_convocatoria: number;
  puntaje_total: number;
  detalle_evaluacion: EvaluationTraceItem[];
  advertencias: string[];
};

type EvaluationActionResponse = {
  id_postulacion: number;
  estado: string;
  puntaje_total: number;
  reglas_aplicadas: number;
  items_evaluados: number;
  items_sin_regla: number;
  advertencias: string[];
};

export type {
  AspirantSummary,
  AspirantDetail,
  AdminPostulacionDetalle,
  AdminPostulacionStatus,
  SoporteItem,
  // Phase 13
  AdminItemSoporte,
  AdminItemDetalle,
  AdminPostulacionDetalleCompleto,
  ItemValidationResponse,
  ObservacionesPayload,
  ObservacionesResponse,
  // Fase 14
  ReglaAplicadaInfo,
  EvaluationTraceItem,
  EvaluationTraceResponse,
  EvaluationActionResponse,
};

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

  // -- Phase 13 endpoints --

  getPostulacionReview: (id: number): Promise<AdminPostulacionDetalleCompleto> =>
    httpClient.get(`/admin/postulaciones/${id}`).then((r) => r.data),

  toggleItemValidation: (itemId: number): Promise<ItemValidationResponse> =>
    httpClient.patch(`/admin/items/${itemId}/validate`).then((r) => r.data),

  saveObservaciones: (
    postulacionId: number,
    payload: ObservacionesPayload,
  ): Promise<ObservacionesResponse> =>
    httpClient.patch(`/admin/postulaciones/${postulacionId}/observaciones`, payload).then((r) => r.data),

  getItemSoportes: (itemId: number): Promise<AdminItemSoporte[]> =>
    httpClient.get(`/admin/items/${itemId}/soportes`).then((r) => r.data),

  getEvaluationTrace: (postulacionId: number): Promise<EvaluationTraceResponse> =>
    httpClient.get(`/admin/postulaciones/${postulacionId}/evaluation-trace`).then((r) => r.data),

  recalculateEvaluation: (postulacionId: number): Promise<EvaluationTraceResponse> =>
    httpClient.post(`/admin/postulaciones/${postulacionId}/recalculate`).then((r) => r.data),

  evaluarPostulacion: (postulacionId: number): Promise<EvaluationActionResponse> =>
    httpClient.post(`/postulaciones/${postulacionId}/evaluar`).then((r) => r.data),

  recalculatePostulacion: (postulacionId: number): Promise<EvaluationActionResponse> =>
    httpClient.post(`/postulaciones/${postulacionId}/recalculate`).then((r) => r.data),
};
